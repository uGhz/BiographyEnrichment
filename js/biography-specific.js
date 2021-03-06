/*global  $, Mustache */
/* jshint -W100 */

$(document).ready(function () {
    "use strict";

    var BIUSANTE_API_BASE_URL = 'http://172.22.100.140/api-draft/public';
    
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
    };
    
    function BiusanteBiographiesModel(application) {
    	
    	// this.normalizedIds = [];
    	// this.wikipediaLinks = [];
    	// this._currentViafId = "";
    	this.application = application;
    }
    
    BiusanteBiographiesModel.prototype = {
    	
    	setCurrentRefbiogr: function (refbiogr) {
    		
    		// Déclenche une nouvelle requête auprès de la Biusanté.
    		this._getBiusanteData(refbiogr);

    	},
    	
    	_getBiusanteData: function(refbiogr) {
            var _self = this;
            var promisedResults = $.Deferred();
            // var queryUrl = "proxy.php?source=biusante-biographies&refbiogr=" + refbiogr;

            var queryUrl = BIUSANTE_API_BASE_URL + '/biographies/' + refbiogr;
            
            console.log("About to request : " + queryUrl);
            var ajaxPromise = $.ajax({
                url: queryUrl,
                dataType: "json"
            });
            
            ajaxPromise.done(function (response) {
                
                console.log("BiusanteBiographiesModel._getBiusanteData. Data found !");
                var biographie = _self._analyzeBiusanteResponse(response);
                
                _self.application.state.setBiusanteBiographie(biographie);

                promisedResults.resolve();
            });
            
            ajaxPromise.always(function () {
                   console.log("BiusanteBiographiesModel. The request for _getBiusanteData is complete!");
            });

            return promisedResults;
    	},
    	
    	_analyzeBiusanteResponse: function (response) {
        	console.log("BiusanteBiographiesModel._analyzeBiusanteResponse. Construction des résultats...");
        	console.log(response);
        	
        	var _self = this;
        	var result = response;

            return result;
    	}
    };
    
    ////
    
    function ViafFileModel(application) {
    	
    	// this.normalizedIds = [];
    	// this.wikipediaLinks = [];
    	// this._currentViafId = "";
    	this.application = application;
    }
    
    ViafFileModel.prototype = {
    	
    	setCurrentViafId: function (viafId) {
    		
    		// Déclenche une nouvelle requête auprès viaf.org.
    		this._getViafData(viafId);

    	},
    	
    	_getViafData: function(viafId) {
            var _self = this;
            var promisedResults = $.Deferred();
            var queryUrl = "proxy.php?source=viaf-file&viaf-id=" + viafId;
            
            console.log("About to request : " + queryUrl);
            var ajaxPromise = $.ajax({
                url: queryUrl,
                dataType: "xml"
            });
            
            ajaxPromise.done(function (response) {
                
                console.log("ViafFileModel._getViafData. Data found !");
                var items = _self._analyzeViafResponse(response);
                
                _self.application.state.setOtherNames(items);

                promisedResults.resolve();
            });
            
            ajaxPromise.always(function () {
                   console.log("ViafFileModel. The request for _getViafData is complete!");
            });

            return promisedResults;
    	},
    	
    	_analyzeViafResponse: function (response) {
        	console.log("ViafFileModel._analyzeViafResponse. Construction des résultats...");
        	console.log(response);
        	
        	
        	var _self = this;

        	
        	var results = [];
        	
        	var $data = $(response);
        	// console.log($data);
        	// var $nodes = $data.find("ns2:x400s > ns2:x400 > ns2:datafield");
        	var $nodes = $data.find("x400");
        	
        	console.log("ViafFileModel._analyzeViafResponse. Nombre de noeuds sélectionnés : " + $nodes.length);
        	
        	var resultObj = {};
        	var tempNode = null;
        	var temptext = "";
        	var trailingComma = /,$/;
        	
        	$.each($nodes, function (index, value) {
        		tempNode = $(this).find("subfield[code='a']");
        		temptext = tempNode.text();
        		temptext = temptext.trim().replace(trailingComma, "");
        		// console.log("ns2 temp : " + temptext);
        		if ( !( temptext in resultObj ) ) {
        			resultObj[temptext] = 0;
        		}
        		
        	});

        	
        	for(var key in resultObj){
            	// console.log(key);
        		results.push(key);
        	}
        	

            return results;
    	}
    };
    
    
    ////
    
    function ViafLinksModel(application) {
    	
    	// this.normalizedIds = [];
    	// this.wikipediaLinks = [];
    	// this._currentViafId = "";
    	this.application = application;
    }
    
    ViafLinksModel.prototype = {
    	
    	setCurrentViafId: function (viafId) {
    		// this._currentViafId = viafId;
    		
    		// Déclenche une nouvelle requête auprès viaf.org.
    		this._getViafData(viafId);
    		
    		// Envoie un événement signalant le début d'une requête.
    		this.application.mainMediator.publish(this.application.mainMediator.VIAF_REQUEST_SENT);
    	},
    	
    	_getViafData: function(viafId) {
            var _self = this;
            var promisedResults = $.Deferred();
           //  var queryUrl = "proxy.php?source=viaf-links&viaf-id=" + viafId;
            
            var queryUrl = BIUSANTE_API_BASE_URL + '/viaf/authority/' + viafId + '/links';
            
            console.log("About to request : " + queryUrl);
            var ajaxPromise = $.ajax({
                url: queryUrl,
                dataType: "json"
            });
            
            ajaxPromise.done(function (response) {
                
                console.log("_getViafData. Data found !");
                var items = _self._analyzeViafResponse(response);
                // _self._analyzer.unsetData();
                
                _self.application.state.setNormalizedIds(items);
               // Envoie un événement signalant la fin d'une requête.
               //  _self.application.mainMediator.publish(_self.application.mainMediator.VIAF_RESPONSE_RECEIVED);
                
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

        	var rawData = response;
        	for (var key in rawData) {
        		  if (rawData.hasOwnProperty(key)) {
        		    console.log(key + " -> " + rawData[key]);
        		    pairItem = new PairItem();
        		    
        		    if (key == "Wikipedia") {
        		    	// this.wikipediaLinks = rawData[key];
        		    	_self.application.state.setWikipediaLinks(rawData[key]);
        		    } else {
        		    
	                    if (key == "WKP") {

	                    	_self.application.state.setCurrentWikidataId(rawData[key]);
	                    	console.log("CurrentWikidataId updated !");
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
        	}
        	
        	console.log("_analyzeViafResponse. Nombre d'IDs : " + tempItems.length);
            // this._resultingResultSet = this._data;
            // this.normalizedIds = tempItems;
            return tempItems;
    	}
    };
    
    function WikidataModel(application) {
    	this.application = application;
    }
    
    WikidataModel.prototype = {
        	setCurrentWikidataId: function (wikidataId) {
        		
        		// Déclenche une nouvelle requête auprès viaf.org.
        		this._getWikidataData(wikidataId);
        		
        		// Envoie un événement signalant le début d'une requête.
        		// this.application.mainMediator.publish(this.application.mainMediator.VIAF_REQUEST_SENT);
        	},
        	
        	_getWikidataData: function(wikidataId) {
                var _self = this;
                var promisedResults = $.Deferred();
                var queryUrl = "proxy.php?source=wikidata&wikidata-id=" + wikidataId;
                
                console.log("About to request : " + queryUrl);
                var ajaxPromise = $.ajax({
                    url: queryUrl,
                    dataType: "json"
                });
                
                ajaxPromise.done(function (response) {
                    
                    console.log("_getWikidataData. Data found !");
                    var imageUrl = _self._analyzeWikidataResponse(response, wikidataId);

                    _self.application.state.setWikidataImageUrl(imageUrl);

                   // Envoie un événement signalant la fin d'une requête.
                   //  _self.application.mainMediator.publish(_self.application.mainMediator.VIAF_RESPONSE_RECEIVED);
                    
                    promisedResults.resolve();
                });
                
                ajaxPromise.always(function () {
                       console.log("The request for _getWikidataData is complete!");
                });

                return promisedResults;
        	},
        	
        	_analyzeWikidataResponse: function (response, wikidataId) {
            	console.log("_analyzeWikidataResponse. Construction des résultats...");

            	console.log("_analyzeWikidataResponse. Data : ");
            	console.dir(response);
            	// [root] entities -> [ID] -> claims -> P18 (= image) -> [0] -> mainsnak -> datavalue -> value
            	
            	// Accès via : https://commons.wikimedia.org/wiki/File: [+ filename]
            	
            	var _self = this;
            	var result = "";

            	var node = response;
            	// var node = null;
//            	if (node.hasOwnProperty("entities")) {
//            		node = node["entities"];
//            		if (node.hasOwnProperty(wikidataId)) {
//            			node = node[wikidataId];
            			if (node.hasOwnProperty("claims")) {
            				node = node.claims;
            				if (node.hasOwnProperty("P18")) {
            					node = node.P18[0];
            					if (node.hasOwnProperty("mainsnak")) {
            						node = node.mainsnak;
                					if (node.hasOwnProperty("datavalue")) {
                						node = node.datavalue;
                    					if (node.hasOwnProperty("value")) {
                    						result = node.value;
                    					}
                					}
            					}
            				}
            			}
//            		}
//            	}
            	
            			
            	//https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Bertrand_Russell_transparent_bg.png&width=300
            	result = "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/" + 
            					result.replace(" ", "_") +
            					"&width=300";
            	console.log("_analyzeViafResponse. Résultat : " + result);
                // this._resultingResultSet = this._data;
                // this.normalizedIds = tempItems;
                return result;
        	}
    };
    
    
    function ViafFormView(application) {
        // Déclarations et initialisations des propriétés
        this._form                  = $("#viafSearchForm");
        this._currentSearch = "";
        this.application = application;
        
    }
    
    ViafFormView.prototype = {
    		
    		initialize: function(viafLinksModel) {
    			
    			this._form          = $("#viafSearchForm");
    	        // Attacher les gestionnaires d'évènements
    	        this._form.submit($.proxy(this.onFormSubmit, this));
    	        // Activer le formulaire de recherche
    	        this._form.find("input").removeAttr("disabled");
    		},
    		
    		onFormSubmit: function( event ) {
                event.preventDefault();
                
                this._currentSearch = this._form.find("input[type='text']").val();
                this.application.state.setCurrentViafSearch(this._currentSearch);
    			this.application.mainMediator.publish(this.application.mainMediator.VIAF_REQUESTED_ID_CHANGED);
    		},
    		
    		getCurrentSearch: function() {
    			return this._currentSearch;
    		}
    };
    
    function ViafNormalizedIdsView(application) {
        // Déclarations et initialisations des propriétés
        this._root = null;
        this.application = application;
        this.normalizedIds = [];
        this._itemContainer = null;
    }
    
    ViafNormalizedIdsView.prototype = {
    		
    		initialize: function () {
    			
    			this._root = $("#viafSearchResults");
    			
    			
    	         var mustacheRendering   = Mustache.render(
                         this.mustacheTemplate,
                         {
                             title: "VIAF",
                             subtitle: "Autorités en tous genres",
                             iconName: "student",
                         }
                 );
    	         
    	         var $contents = $(mustacheRendering);
    	         
    	         $contents.appendTo(this._root);
    	         
    	         this._itemContainer = this._root.find(".ui.table > tbody").first();
    		},
    		
    		_clearItems: function () {
    			this._itemContainer.empty();
    		},
    		
    		update: function() {
    			console.log("ViafNormalizedIdsView is about to be updated !");
    			var ids = this.application.state.getNormalizedIds();
    			var length = ids.length;
    			console.log(length);
    			
    			var renderMaterial = "";
    			var itemRendered = "";
    			for (var index = 0; index < length; index++) {
    				itemRendered = Mustache.render(
                            this.mustacheItemTemplate,
                            ids[index]
                    );
    				renderMaterial += itemRendered;
    				// console.log(itemRendered);
    			}
    			
    			// var $itemContainer = this._root.find(".ui.table > tbody").first();
    			
    			this._clearItems();
    			$(renderMaterial).appendTo(this._itemContainer);

    		},
    		
            mustacheTemplate: function () {
                var template = $('#empty-results-area-template').html();
                Mustache.parse(template);
                return template;
            }(),
            
            mustacheItemTemplate: function () {
                var template = $('#pair-item-template').html();
                Mustache.parse(template);
                return template;
            } ()
    		
    };
    
    
    function WikidataImageView(application) {
        // Déclarations et initialisations des propriétés
        this._root = null;
        this.application = application;
    }
    
    WikidataImageView.prototype = {
    		
    		initialize: function () {
    			
    			this._root = $("#wikidataImageContainer");
    			
    		},
    		
    		_clearItems: function () {
    			this._root.empty();
    		},
    		
    		update: function() {
    			console.log("WikidataImageView is about to be updated !");
    			var imageUrl = this.application.state.getWikidataImageUrl();
    			var sousTitre = "Joined in 2013";
    			// var renderMaterial = "";
    			var itemRendered = Mustache.render(
                            this.mustacheTemplate,
                            {
                            	"cardTitle": "Wikidata",
                            	"cardLogoUrl": "https://upload.wikimedia.org/wikipedia/commons/d/d2/Wikidata-logo-without-paddings.svg",
                            	"title": "My title",
                            	"subtitle": sousTitre,
                            	"imageUrl": imageUrl,
                            	"description": "My short description."
                            }
                );
    			
    			console.log();
    			
    			this._clearItems(itemRendered);
    			$(itemRendered).appendTo(this._root);

    		},
    		
            mustacheTemplate: function () {
                var template = $('#image-card-template').html();
                Mustache.parse(template);
                return template;
            }()
    		
    };
    
    function BiusanteImageView(application) {
        // Déclarations et initialisations des propriétés
        this._root = null;
        this.application = application;
    }
    
    BiusanteImageView.prototype = {
    		
    		initialize: function () {
    			
    			this._root = $("#biusanteImageContainer");
    			
    		},
    		
    		_clearItems: function () {
    			this._root.empty();
    		},
    		
    		update: function() {
    			console.log("BiusanteImageView is about to be updated !");
    			var imageUrl = this.application.state.getBiusanteImageUrl();
    			var sousTitre = "Joined in 2013";
    			// var renderMaterial = "";
    			var itemRendered = Mustache.render(
                            this.mustacheTemplate,
                            {
                            	"cardTitle": "Images et portraits",
                            	"cardLogoUrl": "http://www.biusante.parisdescartes.fr/ressources/images/logo-biusante-officiel.png",
                            	"title": "My title",
                            	"subtitle": sousTitre,
                            	"imageUrl": imageUrl,
                            	"description": "My short description."
                            }
                );
    			
    			console.log();
    			
    			this._clearItems(itemRendered);
    			$(itemRendered).appendTo(this._root);

    		},
    		
            mustacheTemplate: function () {
                var template = $('#image-card-template').html();
                Mustache.parse(template);
                return template;
            }()
    		
    };
    
    function BiusanteBiographieView(application) {
        // Déclarations et initialisations des propriétés
        this._root = null;
        this.application = application;
    }
    
    BiusanteBiographieView.prototype = {
    		
    		initialize: function () {
    			
    			this._root = $("#biusanteBiographieContainer");
    			
    		},
    		
    		_clearItems: function () {
    			this._root.empty();
    		},
    		
    		update: function() {
    			console.log("BiusanteBiographieView is about to be updated !");
    			var biographie = this.application.state.getBiusanteBiographie();
    			
    			var imageUrl = "images/image-exemple.png";
    			if (biographie.referenceBanqueImages) {
    				imageUrl = "http://www.biusante.parisdescartes.fr/images/banque/gd/" + biographie.referenceBanqueImages + ".jpg";
    			}
    			
    			var sousTitre = "";
    			if (biographie.dateNaissance) {
    				sousTitre = "Naissance : " + biographie.dateNaissance;
    				if (biographie.lieuNaissance) {
    					sousTitre += " (" + biographie.lieuNaissance + ")";
    				}
    				sousTitre += "  ";
    			}
    			
    			if (biographie.dateDeces) {
    				sousTitre += "Décès : " + biographie.dateDeces;
    				if (biographie.lieuDeces) {
    					sousTitre += " (" + biographie.lieuDeces + ")";
    				}
    			}
    			
    			var itemRendered = Mustache.render(
                            this.mustacheTemplate,
                            {
                            	"cardTitle": "Biographies",
                            	"cardLogoUrl": "http://www.biusante.parisdescartes.fr/ressources/images/logo-biusante-officiel.png",
                            	"title": biographie.nomComplet,
                            	"subtitle": sousTitre,
                            	"imageUrl": imageUrl,
                            	"description": biographie.commentaire
                            }
                );
    			
    			console.log();
    			
    			this._clearItems(itemRendered);
    			$(itemRendered).appendTo(this._root);

    		},
    		
            mustacheTemplate: function () {
                var template = $('#image-card-template').html();
                Mustache.parse(template);
                return template;
            }()
    		
    };
    
    function ViafOtherNamesView(application) {
        // Déclarations et initialisations des propriétés
        this._root = null;
        this.application = application;
    }
    
    ViafOtherNamesView.prototype = {
    		
    		initialize: function () {
    			
    			this._root = $("#viafOtherNamesContainer");
    			
    		},
    		
    		_clearItems: function () {
    			this._root.empty();
    		},
    		
    		update: function() {
    			console.log("ViafOtherNamesView is about to be updated !");
    			var otherNames = this.application.state.getOtherNames();
    			
    			var itemRendered = Mustache.render(
                            this.mustacheTemplate,
                            {"value": otherNames}
                );
    			
    			// console.log();
    			
    			this._clearItems(itemRendered);
    			$(itemRendered).appendTo(this._root);

    		},
    		
            mustacheTemplate: function () {
                var template = $('#other-names-template').html();
                Mustache.parse(template);
                return template;
            }()
    		
    };
    
    
    function WikipediaLinksView(application) {
        // Déclarations et initialisations des propriétés
        this._root = null;
        this.application = application;
    }
    
    WikipediaLinksView.prototype = {
    		
    		initialize: function () {
    			
    			this._root = $("#wikipediaLinksContainer");
    			
    		},
    		
    		_clearItems: function () {
    			this._root.empty();
    		},
    		
    		update: function() {
    			console.log("WikipediaLinksView is about to be updated !");
    			var wikipediaLinks = this.application.state.getWikipediaLinks();
    			var length = wikipediaLinks.length;
    			// var renderMaterial = "";
    			
    			var re = new RegExp('.*//([a-z]*)\..*');
    			
    			var temp = {"links": []};
    			for (var index = 0; index < length; index++) {
    				temp.links.push( {
    						"label": wikipediaLinks[index].replace(re, '[$1]'),
    						"url": wikipediaLinks[index]
    				});
    			}
    			
    			var itemRendered = Mustache.render(
                            this.mustacheTemplate,
                            temp
                );
    			
    			// console.log();
    			
    			this._clearItems(itemRendered);
    			$(itemRendered).appendTo(this._root);

    		},
    		
            mustacheTemplate: function () {
                var template = $('#wikipedia-links-template').html();
                Mustache.parse(template);
                return template;
            }()
    		
    };
    
    
    function BiographyApplicationState(application) {
    	
    	this.application = application;
    	
    	this.normalizedIds = [];
    	this.wikipediaLinks = [];
    	this.otherNames = [];
    	this.currentViafSearch = "";
    	this.currentRefbiogr = "";
    	this.wikidataId = "";
    	this.wikidataImageUrl = "";
    	this.biusanteImageUrl = "";
    	this.biusanteBiographie = {};

    }
    
    BiographyApplicationState.prototype = {
    		setNormalizedIds: function (normalizedIds) {
    			this.normalizedIds = normalizedIds;
    			
    			// Mise à jour de la liste d'IDs
    			this.application.viafNormalizedIdsView.update();
    		},
    		
    		setWikipediaLinks: function (wikipediaLinks) {
    			this.wikipediaLinks = wikipediaLinks;
    			
    			// Mise à jour de la liste de liens wikipedia
    			this.application.wikipediaLinksView.update();
    		},
    		
    		setOtherNames: function (otherNames) {
    			this.otherNames = otherNames;
    			
    			// Mise à jour de la liste de noms
    			this.application.viafOtherNamesView.update();
    		},
    		
    		getOtherNames: function () {
    			return this.otherNames;
    		},
    		
    		getWikipediaLinks: function () {
    			return this.wikipediaLinks;
    		},
    		
    		setCurrentViafSearch: function (viafSearch) {
    			this.currentViafSearch = viafSearch;
    			
    			// Mise à jour du ViafLinksModel
    			this.application.viafLinksModel.setCurrentViafId(this.currentViafSearch);
    			this.application.viafFileModel.setCurrentViafId(this.currentViafSearch);
    		},
    		
    		setCurrentWikidataId: function (wikidataId) {
    			this.wikidataId = wikidataId;
    			
    			// Mise à jour du WikidataModel
    			this.application.wikidataModel.setCurrentWikidataId(this.wikidataId);
    		},
    		
    		setCurrentRefbiogr: function (refbiogr) {
    			this.currentRefbiogr = refbiogr;
    			
    			// Mise à jour du biusanteBiographiesModel
    			this.application.biusanteBiographiesModel.setCurrentRefbiogr(this.currentRefbiogr);
    		},
    		
    		setBiusanteBiographie: function (biographie) {
    			this.biusanteBiographie = biographie;
    			
    			// Mise à jour du biusanteBiographieView
    			this.application.biusanteBiographieView.update();
    		},
    		
    		getBiusanteBiographie: function () {
    			return this.biusanteBiographie;
    		},
    		
    		setWikidataImageUrl: function (url) {
    			this.wikidataImageUrl = url;
    			
    			// Mise à jour du WikidataImageView
    			this.application.wikidataImageView.update();
    		},
    		
    		getWikidataImageUrl: function () {
    			return this.wikidataImageUrl;
    		},
    		
    		setBiusanteImageUrl: function (url) {
    			this.biusanteImageUrl = url;
    			
    			// Mise à jour du BiusanteImageView
    			this.application.biusanteImageView.update();
    		},
    		
    		getBiusanteImageUrl: function () {
    			return this.biusanteImageUrl;
    		},
    		
    		getNormalizedIds: function () {
    			return this.normalizedIds;
    		}
    		
    };
    

    function BiographyApplication() {
    	
    	this.biusanteBiographiesModel = null;
    	this.viafLinksModel = null;
    	this.viafFileModel = null;
    	this.wikidataModel = null;
    	
    	this.mainMediator = null;
    	
    	this.viafFormView = null;
    	this.viafNormalizedIdsView = null;
    	this.wikipediaLinksView = null;
    	this.wikidataImageView = null;
    	this.biusanteImageView = null;
    	this.viafOtherNamesView = null;
    	this.biusanteBiographieView = null;
    	
    	this.state = {};
    }
    
    BiographyApplication.prototype = {
    		initialize: function () {
    			this.mainMediator = new Mediator();
    			
    		    this.biusanteBiographiesModel = new BiusanteBiographiesModel(this);
    		    this.viafLinksModel = new ViafLinksModel(this);
    		    this.viafFileModel = new ViafFileModel(this);
    		    this.wikidataModel = new WikidataModel(this);
    		    
    			this.viafFormView = new ViafFormView(this);
    			this.viafFormView.initialize();
    			
    			this.viafNormalizedIdsView = new ViafNormalizedIdsView(this);
    			this.viafNormalizedIdsView.initialize();
    			
    			this.wikipediaLinksView = new WikipediaLinksView(this);
    			this.wikipediaLinksView.initialize();
    			
    			this.wikidataImageView = new WikidataImageView(this);
    			this.wikidataImageView.initialize();
    			
    			this.biusanteBiographieView = new BiusanteBiographieView(this);
    			this.biusanteBiographieView.initialize();
    			
    			this.biusanteImageView = new BiusanteImageView(this);
    			this.biusanteImageView.initialize();
    			
    			this.viafOtherNamesView = new ViafOtherNamesView(this);
    			this.viafOtherNamesView.initialize();
    			
    			this.state = new BiographyApplicationState(this);
    		    
    		},
    		
    		onViafRequestedIdChanged: function () {
    			this.viafLinksModel.setCurrentViafId(this.viafFormView.getCurrentSearch());
    		}
    };
    
    var ba = new BiographyApplication();
    ba.initialize();
    
	$('.ui.search')
	  .search({
		apiSettings: { url: '/proxy.php?id={id}'},
		type          : 'standard',
	    source : referenceData,
//	    searchFields   : [
//	      'nom',
//	      'title',
//	      'viafId'
//	    ],
//	    fields: {
//	        results : 'results'
//	        title   		: 'nom'
//	        description     : 'urlImage'
//	      },
	    minCharacters : 3,
	    searchFullText: false,
	    debug: true,
	    verbose: true,
	    onSelect: function (result, response) {
			console.log(".ui.search. Item selected !");
			console.log(result);
			console.log("VIAF ID to set : " + result.viafId);
			ba.state.setCurrentViafSearch(result.viafId);
			ba.state.setCurrentRefbiogr(result.refbiogr);
			ba.state.setBiusanteImageUrl(result.image.replace("/pt/", "/gd/"));
	    }
	  })
	;
});