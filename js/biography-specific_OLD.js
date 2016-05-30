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
    
    
    function DataResultSet() {
        // this.numberOfResults    = null;
        this.results            = [];
        this.warningMessage     = "";
    }
    
    DataResultSet.prototype = {
        WARNING_MESSAGE: {
            TOO_MUCH_RESULTS: "Votre recherche renvoie de trop nombreux résultats. Merci de l'affiner."
        }    
    };
    
    /**
     * Value Object représentant un résultat, une référence bibliographique.
     * 
     * @todo Ajouter un tableau de "tags". 
     * @todo Ajouter un tableau d'exemplaires.
     * @todo Ajouter une information "Accès libre" (vs. accès sur identification).
     * @todo Ajouter, éventuellement, une information "langue". // Pas prioritaire.
     * @todo Ajouter, éventuellement, une information "Pays". // Pas prioritaire.
     * @todo Ajouter, éventuellement, une information "description".
     */
    function DataItem() {
        this.label             = null;
        this.value             = null;
    }
    
    /**
     * Value Object représentant une page de résultats bibliographiques.
     * 
     * @property {Number}   numberOfResults   Il s'agit du nombre total de résultats correspondant à la requête sur la source de données.
     * @property {Array}    results           Tableau de DataItem.
     * @property {Number}   currentPage       Index de la page courante (base 1).  
     */
    DataItem.prototype = {
        mustacheTemplate: function () {
            var template = $('#data-item-template').html();
            Mustache.parse(template);
            return template;
        }()
    };
    
    function DataProviderFactory() {}
    
    DataProviderFactory.prototype = {
        
        getInstance: function ( dataProviderType ) {
            
            var parametersMap = {};
            
            switch (dataProviderType) {
            
                case "ViafData":
                    parametersMap = {
                        implementation:     new ViafDataAnalyzer(),
                        dataType:           "json"
                    };
                    break;
            }
            
            var fdp = new FacadeDataProvider(parametersMap);
            
            return fdp;
            
        }
        
    };
    
    /*********************************
     *   CLASS FacadeDataProvider
     *
     
     - Possède une URL d'accès
     
     - Méthodes :
         - Publiques :
         --- getDetailedItem
             @param  url           // Pointant sur une représentation distante et détaillée de la ressource
             @return copies        // Un tableau d'informations sur des exemplaires de la ressources

     */
     function FacadeDataProvider( parametersMap ) {
         // Propriétéliées au paramétrage du modèle
         this._analyzer              = parametersMap.implementation;
         this._DATA_TYPE             = parametersMap.dataType;
         
         // Propriétés gérant l'état du modèle
         this._currentQueryString    = "";

     }

     FacadeDataProvider.prototype = {
         
       
         // Fonction publique, que les ResultAreas sont susceptibles d'appeler.
         getFreshSearchResults: function ( searchString ) {

             this._currentQueryString = searchString;
             var queryUrl = this._analyzer.buildRequestUrl(this._currentQueryString);
             
             return this._sendRequest(queryUrl);
         },
         
        
         _sendRequest: function ( queryUrl ) {
             
             var _self = this;
             
             var promisedResults = $.Deferred();
             
             console.log("About to request : " + queryUrl);
             var ajaxPromise = $.ajax({
                 // The URL for the request
                 
                 url: queryUrl,
                 dataType: this._DATA_TYPE,
             });
             
             ajaxPromise.done(function (response) {
                 
                     _self._analyzer.analyze(response);

                     var resultSet                   = _self._analyzer.getResultSet();
                 
                     console.log("_sendRequest. Data found !");

                 
                     _self._analyzer.unsetData();
                     promisedResults.resolve(resultSet);
             });
             
             ajaxPromise.always(function () {
                    console.log("The request for _sendRequest is complete!");
             });

             return promisedResults;
         }
     };
    
    function ViafDataAnalyzer() {
        this._data = null;
        this._resultingResultSet = null;
    }
    
    ViafDataAnalyzer.prototype = {
        
        // Implémentation OK
        analyze: function (data) {
            this._data = $(data);
            this._buildResultSet();
        },
        
        // Implémentation OK
        unsetData: function () {
          this._data = null;  
        },
    
        // Implémentation OK
        getResultSet: function () {
            return this._resultingResultSet;
        },
        
        // Implémentation OK
        buildRequestUrl: function (searchString) {
            return "proxy-viaf.php?viaf-id=" + searchString;
        },

        // Construit un DataResultSet à partir des données brutes stockées dans _data
        // et le stocke dans _resultingResultSet.
        _buildResultSet: function () {
        	
        	console.log("ViafDataAnalyzer. Construction des résultats...");

        	console.log("ViafDataAnalyzer. Data : " + this._data);
        	var _self = this;
        	var resultSet = new DataResultSet();
        	var tempItems = [];
        	var tempDataItem = null;

        	var rawData = this._data[0];
        	for (var key in rawData) {
        		  if (rawData.hasOwnProperty(key)) {
        		    console.log(key + " -> " + rawData[key]);
                    tempDataItem = _self._buildDataItem([key, rawData[key]]);
                    tempItems.push(tempDataItem);
        		  }
        	}
        	resultSet.results = tempItems;
        	
            // this._resultingResultSet = this._data;
            this._resultingResultSet = resultSet;
        },

        
            /*
             *
            */
        _buildDataItem: function (pieceOfData) {
        	console.log("ViafDataAnalyzer. Analyse d'un data item...");
        	
            var item = new DataItem();
            
            if (ReferenceData.ViafAuthorities[pieceOfData[0]]) {
            	item.label = ReferenceData.ViafAuthorities[pieceOfData[0]];
            } else {
                item.label = pieceOfData[0];
            }

            item.value = pieceOfData[1];
            return item;
        }

    };
    /*********************************
     *   CLASS ViafSearchWidget
     */
    function ViafSearchWidget() {
    	
        // Déclarations et initialisations des propriétés
        this._form                  = $("#viafSearchForm");
        
        // this._container             = $("#hipSearchArea");

        this._searchResultsContainer= $("#viafSearchResults");
        
        // this._statsContainer        = this._form.find(".statistic");
        
        this._currentRequest        = "";
        this._activeResultAreasSet  = [];
        // this._resultAreasSets       = [];
        
        // Créer et attacher les ResultAreas
        var dpf = new DataProviderFactory();
        
        this._activeResultAreasSet.push(
                new ResultsArea("VIAF", "Autorités en tous genres", "student", this, dpf.getInstance("ViafData"))
        );
        
        // Attacher les gestionnaires d'évènements
        this._form.submit($.proxy(this._updateCurrentRequest, this));
        
        // Initialiser les champs de formulaire
        var _self = this;
        
        // Activer le formulaire de recherche
        this._form.find("input").removeAttr("disabled");
    }
    
    ViafSearchWidget.prototype = {
            
            // Fonction publique, que les ResultAreas sont susceptibles d'appeler. 
            getSearchString: function () {
                return this._currentRequest;
            },
            
            // Fonction publique, que les ResultAreas sont susceptibles d'appeler. 
            getResultsContainer: function () {
                return this._searchResultsContainer;
            },
            
            _updateCurrentRequest: function ( event ) {
                event.preventDefault();
                
                
                // Notifier la chose aux ResultAreas
                var tempResultArea = null;
                var tempPromise = null;
                var promises = [];
                var _self = this;
                
                this._currentRequest = this._form.find("input[type='text']").val();
                // console.log("_currentRequest updated : " + this._currentRequest);
                this._setLoadingStateOn();
                
                // var updateStatsFunction = function () {_self._updateStats();};
                
                for(var i=0, len=this._activeResultAreasSet.length; i < len ; i++) {
                    tempResultArea = this._activeResultAreasSet[i];
                    if (tempResultArea) {
                        tempPromise = tempResultArea.handleQueryUpdate();
                        // tempPromise.done(updateStatsFunction);
                        promises.push(tempPromise);   
                    }
                }
                
                // this._updateStats();
                
                $.when.apply($, promises).always(
                    function () {
                        _self._setLoadingStateOff();
                    }
                );

            },
            
            _setLoadingStateOn: function () {
                this._form.addClass("loading");
            },
            
            _setLoadingStateOff: function() {
                this._form.removeClass("loading");
            }
        };
    
    /*********************************
     *   CLASS ResultsArea
     *
         - Possède un pointeur dans le DOM vers le conteneur de la liste de résultats
         - Possède un pointeur dans le DOM vers le formulaire HTML de recherche
         - Possède un pointeur dans le DOM vers le conteneur des statistiques de recherche
         - Stocke la requête en cours
         - Stocke le nombre de résultats de la requête en cours
         - Stocke le numéro de la page de résultats en cours
         
         - Méthodes :
             - Publiques :
             --- _updateCurrentRequest // Récupère la requête saisie par l'utilisateur
             --- _setLoadingStateOn
             --- _setLoadingStateOff
             --- _setStats

             --- _askForItemDetails
             --- askForNewResultSet
             --- _handleNewItemDetails
             --- _handleNewResultSet
     */
     function ResultsArea(title, subtitle, iconName, searchArea, dataProvider) {
         
         // Initialisées à la création de l'objet
         this._searchArea    = searchArea;
         this._dataProvider  = dataProvider;
         this._title         = title;
         this._subtitle      = subtitle;
         this._iconName      = iconName;
         
         // Déclarer les autres propriétés
         // this._currentTotalResults   = null;
         this._container             = null;
         // this._statsContainer        = null;
     
         // Construire le balisage HTML/CSS
         var mustacheRendering   = Mustache.render(
                                         this.mustacheTemplate,
                                         {
                                             title: this._title,
                                             subtitle: this._subtitle,
                                             iconName: this._iconName
                                         });
         this._container         = $(mustacheRendering);
         // this._statsContainer    = this._container.find("div.statistic");
     
         // Activer la ResultArea :
         // - la vider,
         // - y attacher les gestionnaires d'évènements,
         // - la rattacher au conteneur idoine.
         this.activate();
     }

     ResultsArea.prototype = {
         
         activate: function () {
             this._clear();
             
             var _self = this;
             
             // Ajouter ici les éventuels event listeners.
             
             this._container.appendTo(this._searchArea.getResultsContainer());
         },
         
         // Fonction publique, que les SearchArea sont susceptibles d'appeler.
         handleQueryUpdate: function () {
             this._clear();
             return this._askForResults.call(this, this._searchArea.getSearchString(), true);
         },
         
         mustacheTemplate: function () {
             var template = $('#empty-results-area-template').html();
             Mustache.parse(template);
             return template;
         }(),
         
         _askForResults: function( request, isNewSearch ) {
             
             this._setLoadingStateOn();
             
             var resultsHandled = $.Deferred();
             var promisedResults = null;
             
             if (isNewSearch === true) {
                 promisedResults = this._dataProvider.getFreshSearchResults(request);
             } else {
                 promisedResults = this._dataProvider.getNextSearchResults();
             }
             
             var _self = this;
             promisedResults
                 .done(
                     function( results ) {
                         _self._handleNewResultSet( results );
                        //  _self._askForThumbnailUrl();
                     }
                 ).always(
                     function () {
                         _self._setLoadingStateOff();
                         resultsHandled.resolve();
                     }
             );

             return resultsHandled;
         },
         
         _setLoadingStateOn: function () {
             this._container.children(".dimmer").addClass("active");
         },

         _setLoadingStateOff: function () {
             this._container.children(".dimmer").removeClass("active");
         },
         
         _buildResultItem: function (dataItem) {
             
             var newDomItem = $(Mustache.render(dataItem.mustacheTemplate, dataItem));
             return $(newDomItem);
         },

         
         /*
         _setItemLoadingStateOn: function (domItem) {
             domItem.find(".dimmer").addClass("active");
         },

         _setItemLoadingStateOff: function (domItem) {
             domItem.find(".dimmer").removeClass("active");
         },
         */
         
         _handleNewResultSet: function (resultSet) {
           console.log("_handleNewResultSet has been called !");

           // console.log("Results handled !");

             // this._currentTotalResults  = parseInt(resultSet.numberOfResults, 10);
             // this._currentTotalResults  = this._dataProvider.getTotalOfResults();

             // Récupérer, ligne à ligne, les données,
             // les mettre en forme et les attacher au conteneur d'items
             var tempDomItem = null;
             
             var listRoot = $("<table></table>");
             var resultsArray = resultSet.results;
             for (var i = 0, len = resultsArray.length; i < len; i++) {
                 tempDomItem = this._buildResultItem(resultsArray[i]);
                 tempDomItem.appendTo(listRoot);
             }
             
             this._container.find(".ui.table").append($("<tbody></tbody>")).append(listRoot.children("tr"));
             
             // Supprimer le bouton "Plus de résultats".
             this._container.find("div.message").remove();
             
             if (resultSet.warningMessage === resultSet.WARNING_MESSAGE.TOO_MUCH_RESULTS) {
                 $("<div class='ui icon info message'><i class='warning icon'></i><div class='content'><div class='header'>Trop de réponses.</div><p>Merci d'affiner votre recherche.</p></div></div>")
                     .appendTo(this._container);
             } else {
            	 // Rien ?
             }

         },
         
         _clear: function() {
        	 console.log("ResultsArea._clear called !");
             this._container.children(".ui.table").empty();
             this._container.children(".message").remove();

         }
     };
     
     // Lancement du widget
     new ViafSearchWidget();
    
});