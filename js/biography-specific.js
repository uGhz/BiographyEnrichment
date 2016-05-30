/*jslint browser: true*/
/*global  $, Mustache */
// Using the module pattern for a jQuery feature

$(document).ready(function () {
    "use strict";

    
    
    var ReferenceData = {
    		"ViafAuthorities" : {
	    		"ALL" : "All source data within VIAF",
	    		"BAV" : "Biblioteca Apostolica Vaticana",
	    		"BNE" : "Biblioteca Nacional de España",
	    		"BNF" : "Bibliothèque Nationale de France",
	    		"DNB" : "Deutsche Nationalbibliothek",
	    		"EGAXA" : "Bibliotheca Alexandrina (Egypt)",
	    		"ICCU" : "Istituto Centrale per il Catalogo Unico",
	    		"JPG" : "Getty Research Institute",
	    		"LC" : "Library of Congress/NACO",
	    		"LAC" : "Library and Archives Canada",
	    		"NKC" : "National Library of the Czech Republic",
	    		"NLA" : "National Library of Australia",
	    		"NLIara" : "National Library of Israel (Arabic)",
	    		"NLIcyr" : "National Library of Israel (Cyrillic)",
	    		"NLIheb" : "National Library of Israel (Hebrew)",
	    		"NLIlat" : "National Library of Israel (Latin)",
	    		"NUKAT" : "The National Union Catalog of Poland",
	    		"PTBNP" : "Biblioteca Nacional de Portugal",
	    		"SELIBR" : "National Library of Sweden",
	    		"SWNL" : "Swiss National Library"
    		}
    };
    
    function PairItem() {
        this.label             = null;
        this.value             = null;
    }
    
    function Mediator() {
    	this.events = {};
    }
    
    Mediator.prototype = {
    		
    		// Event Names
    		VIAF_REQUESTED_ID_CHANGED	: "VIAF_REQUESTED_ID_CHANGED",
    		VIAF_REQUEST_SENT			: "VIAF_REQUEST_SENT",
    		VIAF_RESPONSE_RECEIVED		: "VIAF_RESPONSE_RECEIVED",
    		
    		subscribe: function (eventName, callback) {
    			if (!this.events.hasOwnProperty(eventName)) {
    				this.events[eventName] = [];
    			}
    			
    			this.events[eventName].push(callback);
    		},
    		
    		unsubscribe: function (eventName, callback) {
    			var index = 0,
    				length = 0;
    			
    			if (this.events.hasOwnProperty(eventName)) {
    				length = this.events[eventName].length;
    				
    				for (; index < length; index++) {
    					if (this.events[eventName][index] === callback) {
    						this.events[eventName].splice(index, 1);
    						break;
    					}
    				}
    			}
    		},
    		
    		publish: function (eventName) {
    			var data = Array.prototype.slice.call(arguments, 1),
    				index = 0,
    				length = 0;
    			
    			console.log("Event published ! Event Name : " + eventName + ". Data : " + data);
    			if (this.events.hasOwnProperty(eventName)) {
    				length = this.events[eventName].length;
    				
    				for (; index < length; index++) {
    	    			console.log("A registered event listener has been found !");
    					this.events[eventName][index].apply(this, data);
    				}
    			}
    		}
    }
    
    
    function ViafModel(mainMediator) {
    	
    	this.normalizedIds = [];
    	this.wikipediaLinks = [];
    	this._currentViafId = "";
    	this.mainMediator = mainMediator;
    }
    
    ViafModel.prototype = {
    	
    	setCurrentViafId: function (viafId) {
    		this._currentViafId = viafId;
    		
    		// TODO. Déclenche une nouvelle requête auprès viaf.org.
    		this._getViafData();
    		
    		// Envoie un événement signalant le début d'une requête.
    		this.mainMediator.publish(this.mainMediator.VIAF_REQUEST_SENT);
    	},
    	
    	getNormalizedIds: function () {
    		return this.normalizedIds;
    	},
    	
    	getWikipediaLinks: function () {
    		return this.wikipediaLinks;
    	},
    	
    	_getViafData: function() {
            var _self = this;
            var promisedResults = $.Deferred();
            var queryUrl = "proxy-viaf.php?viaf-id=" + this._currentViafId;
            
            console.log("About to request : " + queryUrl);
            var ajaxPromise = $.ajax({
                url: queryUrl,
                dataType: "json"
            });
            
            ajaxPromise.done(function (response) {
                
                console.log("_getViafData. Data found !");
                _self._analyzeViafResponse(response);
                // _self._analyzer.unsetData();
                
             // TODO. Envoie un événement signalant la fin d'une requête.
                _self.mainMediator.publish(_self.mainMediator.VIAF_RESPONSE_RECEIVED);
                
                promisedResults.resolve();
            });
            
            ajaxPromise.always(function () {
                   console.log("The request for _getViafData is complete!");
            });

            return promisedResults;
    	},
    	
    	_analyzeViafResponse: function (response) {
        	console.log("_analyzeViafResponse. Construction des résultats...");

        	// console.log("ViafDataAnalyzer. Data : " + this._data);
        	var _self = this;
        	// var resultSet = new DataResultSet();
        	var tempItems = [];
        	var pairItem = null;

        	var rawData = response[0];
        	for (var key in rawData) {
        		  if (rawData.hasOwnProperty(key)) {
        		    console.log(key + " -> " + rawData[key]);
        		    pairItem = new DataItem();
        		    
        		    if (key == "Wikipedia") {
        		    	this.wikipediaLinks = rawData[key];
        		    }
        		    
                    if (ReferenceData.ViafAuthorities[key]) {
                    	pairItem.label = ReferenceData.ViafAuthorities[key];
                    } else {
                    	pairItem.label = key;
                    }

                    pairItem.value = rawData[key];
                    tempItems.push(pairItem);
        		  }
        	}
        	
            // this._resultingResultSet = this._data;
            this.normalizedIds = tempItems;
    	}
    }
    
    
    function ViafFormView(mainMediator) {
        // Déclarations et initialisations des propriétés
        this._form                  = $("#viafSearchForm");
        this._currentSearch = "";
        this.mainMediator = mainMediator;
        
    }
    
    ViafFormView.prototype = {
    		
    		initialize: function(viafModel) {
    			
    			this._form          = $("#viafSearchForm");
    	        // Attacher les gestionnaires d'évènements
    	        this._form.submit($.proxy(this.onFormSubmit, this));
    	        // Activer le formulaire de recherche
    	        this._form.find("input").removeAttr("disabled");
    		},
    		
    		onFormSubmit: function( event ) {
                event.preventDefault();
                
                this._currentSearch = this._form.find("input[type='text']").val();
    			this.mainMediator.publish(this.mainMediator.VIAF_REQUESTED_ID_CHANGED);
    		},
    		
    		getCurrentSearch: function() {
    			return this._currentSearch;
    		}
    }
    
    function ViafNormalizedIdsView(mainMediator) {
        // Déclarations et initialisations des propriétés
        this._root = null;
        this.mainMediator = mainMediator;
        this.normalizedIds = [];
        this._itemContainer = null;
    }
    
    ViafNormalizedIdsView.prototype = {
    		
    		initialize: function () {
    			
    			this._root = $("#viafSearchresults");
    			
    			
    	         var mustacheRendering   = Mustache.render(
                         this.mustacheTemplate,
                         {
                             title: "VIAF",
                             subtitle: "Autorités en tous genres",
                             iconName: "student",
                         });
    	         this._itemContainer = $(mustacheRendering);
    	         
    	         this._itemContainer.appendTo(this._root)
    		},
    		
            mustacheTemplate: function () {
                var template = $('#empty-results-area-template').html();
                Mustache.parse(template);
                return template;
            }(),
    		
    		setNormalizedIds: function (normalizedIds) {
    			this.normalizedIds = normalizedIds;
    		},
    		
    		update: function() {
    			
    		}
    }
    

    function BiographyApplication() {
    	this.viafModel = null;
    	this.mainMediator = null;
    	this.viafFormView = null;
    	this.viafNormalizedIdsView = null;
    }
    
    BiographyApplication.prototype = {
    		initialize: function () {
    			this.mainMediator = new Mediator();
    		    
    		    this.viafModel = new ViafModel(this.mainMediator);
    		    
    			this.viafFormView = new ViafFormView(this.mainMediator);
    			this.viafFormView.initialize();
    			
    			this.viafNormalizedIdsView = new ViafNormalizedIdsView(this.mainMediator);
    			this.viafNormalizedIdsView.initialize();
    		    
    		    this.mainMediator.subscribe(
    		    		// $.proxy(this._updateCurrentRequest, this)
    		    		this.mainMediator.VIAF_REQUESTED_ID_CHANGED, $.proxy(this.onViafRequestedIdChanged, this)
    		    );
    		},
    		
    		onViafRequestedIdChanged: function () {
    			this.viafModel.setCurrentViafId(this.viafFormView.getCurrentSearch());
    		}
    }
    
    var ba = new BiographyApplication();
    ba.initialize();
    
    
});