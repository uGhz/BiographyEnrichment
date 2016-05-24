/*jslint browser: true*/
/*global  $, Mustache */
// Using the module pattern for a jQuery feature

$(document).ready(function () {
    "use strict";

    
    
    function DataProviderFactory() {}
    
    DataProviderFactory.prototype = {
        
        getInstance: function ( dataProviderType ) {
            
            var parametersMap = {};
            
            switch (dataProviderType) {
            
                case "ViafData":
                    parametersMap = {
                        implementation:     new ViafDataAnalyzer(),
                        maxResultsPerPage:  20,
                        dataType:           "xml"
                    };
                    break;
            }
            
            var fdp = new FacadeDataProvider(parametersMap);
            
            return fdp;
            
        }
        
    };
    
    
    
    function ViafDataAnalyzer() {
        this._data = null;
        this._pageNumber = 0;
        this._numberOfResults = 0;
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
        getPageNumber: function () {
            return this._pageNumber;
        },
    
        // Implémentation OK
        getTotalOfResults: function () {
            return this._numberOfResults;
        },
    
        // Implémentation OK
        getResultSet: function () {
            return this._resultingResultSet;
        },
        
        // Implémentation OK
        buildRequestUrl: function (searchString, pageNumber) {
            
            // http://www2.biusante.parisdescartes.fr/perio/index.las?do=rec&let=0&rch=human+genetics
            var urlArray = [
                "proxy-perio.php?do=rec&let=0&rch=",
                encodeURIComponent(searchString)
            ];
            
            if (pageNumber) {
                urlArray = urlArray.concat([
                    "&p=",
                    encodeURIComponent(pageNumber)
                ]);
            }
            
            var url = urlArray.join("");
            
            return url;
        },
        
        // Implémentation OK
        buildItemUrl: function () {
            return null;
        },
        
        // Implémentation OK
        _extractPageNumber: function ($searchScope) {
            var result = 1;
            
            // var wrappingTable = this._data.find("#table242");
            
            var $flecheGauche = $searchScope
                            // .find("tr:nth-child(1)>td")
                            .find("img[src$='flecheptg.gif'][alt^='page ']");
            
            console.log("EPeriodicalSpecificDataAnalyzer. $flecheGauche found : " + $flecheGauche.length);
            if ($flecheGauche.length > 0) {
                
                var urlPagePrecedente = $flecheGauche.parent().attr("href");
                console.log("EPeriodical. urlPagePrecedente found : " + urlPagePrecedente);
                var regexResult = /p=(\d+)/g.exec(urlPagePrecedente);
                
                if (regexResult) {
                    result = parseInt(regexResult[1], 10) + 1;
                }
            }
                
            console.log("EPeriodical page number : " + result);
            return result;
        },

        // Implémentation OK
        _buildResultSet: function () {
        	
        	console.log("EPeriodical. Construction des résultats Pério. électr...");
        	
            var $rawData = $("<html></html>").append($("<body></body>")).append(this._data);
            // console.log("EPeriodical. $rawData : " + $rawData);
            // console.log("EPeriodical. $rawData HTML : " + $rawData.html());
            
            var resultSet = new CatalogResultSet();
            
            var wrappingTable = $rawData.find('#table242').first();
            // console.log("Tables in $rawData : " + $rawData.find('table').length);
            
            // Récupérer le nombre de résultats
            var tempVar = parseInt($rawData.find(".nombre-resultats").text(), 10);
            if (isNaN(tempVar)) {
            	tempVar = 0;
            }
            console.log("EPeriodical. nombre-resultats : '" + tempVar + "'");
            this._numberOfResults = tempVar;
            
            // Calculer le numéro de la page courante
            this._pageNumber = this._extractPageNumber(wrappingTable);

            // Récupérer, ligne à ligne, les données, les mettre en forme et les attacher à la liste
            var tempItems = [];
            var tempDataItem = null;

            var _self = this;

            $rawData.find('.ligne-titre').each(function (index, value) {
                    tempDataItem = _self._buildDataItem($(value));
                    tempItems.push(tempDataItem);
            });

            resultSet.results = tempItems;

            this._resultingResultSet = resultSet;
        },

        
            /*
             * TODO. A METTRE A JOUR.
             * $("#table247"), 2ème ligne tr, 1er td, 1er p, text, pageNumber après "Nombre de réponses : " et avant le 1er "&"
             * Si table247 possède moins de 4 lignes tr, la recherche n'a ramené aucun résultat.
             * #table247, chaque tr[x] (3 < x < tr.length) correspond à une référence d'ouvrage
             * chaque tr :
             * - 1er td : Type de document / d'accès
             * -2ème td :
             *      - p > a > b.text -> Titre,
             *      - p> a.href -> URL d'accès en ligne
             *      - div > i.text -> Description, commentaire
             *      - div.text -> Auteurs, entre "Par " et " . " (?)
             *      - div > font.text -> Tag (plusieurs occurrences)
             *
            */
        _buildDataItem: function ($htmlData) {
        	console.log("EPeriodical. Analyse d'un périodique électronique...");
        	
            var item = new CatalogItem();
            var directAccesses = [];
            //var cell2 = rawXmlData.find('td > b > span');
            // 
            item.title          = $htmlData.find('.titre').text();
            item.publisher      = $htmlData.find('.editeur').text();
            
            var siblings = $htmlData.nextUntil('tr.ligne-titre');
            console.log("Current title : " + item.title);
            console.log("siblings : " + siblings.length);
            
            /* WORK IN PROGRESS */
            var da = null;
            var tempNode = null;
            var tempString = "";
            var regexResult = null;
            
            siblings.each(function () {
            	
                tempNode = $(this);
                da = new DirectAccess();
                
                da.url = "http://www.biusante.parisdescartes.fr/chercher/revues.php" + tempNode.find('.lien-acces-direct').attr('href');
                console.log("da.url : " + da.url);

                da.provider = tempNode.find('.fournisseur-acces').text();
                console.log("da.provider : " + da.provider);
                
                da.holdings = tempNode.find('.etat-collection').text();
                console.log("da.holdings : " + da.holdings);
                
                directAccesses.push(da);
            });
            
            item.directAccesses = directAccesses;
           
            return item;
        },

        getAsCatalogItem: function () {
            throw "Exception : UnsupportedOperationException";
        }

    };
    /*********************************
     *   CLASS ViafSearchWidget
     *
     *
         Classe gérant le formulaire de recherche et englobant les différentes ResultsArea
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
                this._setLoadingStateOn();
                
                // var updateStatsFunction = function () {_self._updateStats();};
                
                for(var i=0, len=this._activeResultAreasSet.length; i < len ; i++) {
                    tempResultArea = this._activeResultAreasSet[i];
                    if (tempResultArea) {
                        tempPromise = tempResultArea.handleQueryUpdate();
                        tempPromise.done(updateStatsFunction);
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
                this._form.children(".ui.search").addClass("loading");
            },
            
            _setLoadingStateOff: function() {
                this._form.children(".ui.search").removeClass("loading");
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
         this._currentTotalResults   = null;
         this._container             = null;
         this._statsContainer        = null;
     
         // Construire le balisage HTML/CSS
         var mustacheRendering   = Mustache.render(
                                         this.mustacheTemplate,
                                         {
                                             title: this._title,
                                             subtitle: this._subtitle,
                                             iconName: this._iconName
                                         });
         this._container         = $(mustacheRendering);
         this._statsContainer    = this._container.find("div.statistic");
     
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
             this._container.on("click", "a.header", $.proxy(_self._askForItemDetails, _self));
             this._container.on("click", "button.catalog-link", function () {
                 window.open($(this).attr("data-catalog-url"));
             });
             this._container.on("click", "button.online-access-link", function () {
                 window.open($(this).attr("data-online-access-url"));
             });
             this._container.on("click", "button.more-results", $.proxy(_self._handleMoreResultsAction, _self));

             this._container.appendTo(this._searchArea.getResultsContainer());
         },
         
         // Fonction publique, que les SearchArea sont susceptibles d'appeler.
         handleQueryUpdate: function () {
             this._clear();
             return this._askForResults.call(this, this._searchArea.getSearchString(), true);
         },
         
         // Fonction publique, que les SearchArea sont susceptibles d'appeler.
         /*
         getStats: function () {
             return parseInt(this._currentTotalResults, 10);
         },
         */
         
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
                         _self._askForThumbnailUrl();
                     }
                 ).always(
                     function () {
                         _self._setLoadingStateOff();
                         resultsHandled.resolve();
                     }
             );

             return resultsHandled;
         },
         
         /*
         _handleMoreResultsAction: function (event) {
             event.preventDefault();
             return this._askForResults();
         },
         */
         
         /*
         _askForItemDetails: function ( event ) {

             event.preventDefault();

             var domItem = $(event.currentTarget).closest(".item");

             this._setItemLoadingStateOn(domItem);

             var promisedResults = this._dataProvider.getDetailedItem(domItem.data("catalog-url"));
             
             var _self = this;
             promisedResults.done(function ( results ) {   
                 _self._handleNewItemDetails(results, domItem);
                 _self._setItemLoadingStateOff(domItem);
             });
         },
         */
         
         /*
         _redirectToCatalogDetailPage: function ( event ) {
             var domItem = $(event.currentTarget).closest(".item");
             window.location.href = domItem.data("catalog-url");
         },
         */
         
         _setLoadingStateOn: function () {
             this._container.children(".dimmer").addClass("active");
         },

         _setLoadingStateOff: function () {
             this._container.children(".dimmer").removeClass("active");
         },

         /*
         _setStats: function (nResults) {
             // Créer au besoin les éléments nécessaires à l'affichage des stats
             // Mettre à jour ces éléments
           // console.log("_setStats called ! nResults : " + nResults);
             this._statsContainer.children(".value").text(nResults);
         },
         */
         
         _buildResultItem: function (dataItem) {
             
             var newDomItem = $(Mustache.render(dataItem.mustacheTemplate, dataItem));
             
             // Stockage de données spécifiques à l'item
             newDomItem.data("catalog-url", dataItem.catalogUrl);
             newDomItem.data("isbn", dataItem.isbn);

             return $(newDomItem);
         },

         _setItemLoadingStateOn: function (domItem) {
             domItem.find(".dimmer").addClass("active");
         },

         _setItemLoadingStateOff: function (domItem) {
             domItem.find(".dimmer").removeClass("active");
         },
         
         /*
         _handleNewItemDetails: function (detailedItem, domItem) {
           // console.log("_handleNewItemDetails has been called !");
             
             var newItem = this._buildResultItem(detailedItem);
             newItem.find("span.label.popup-conditions").popup();
             domItem.replaceWith(newItem);
             
           // console.log("handleDetails is finished !");
         },
         */
         
         _handleNewResultSet: function (resultSet) {
           // console.log("_handleNewResultSet has been called !");

           // console.log("Results handled !");

             // this._currentTotalResults  = parseInt(resultSet.numberOfResults, 10);
             this._currentTotalResults  = this._dataProvider.getTotalOfResults();

             // Récupérer, ligne à ligne, les données,
             // les mettre en forme et les attacher au conteneur d'items
             var tempDomItem = null;
             
             var listRoot = $("<div class='ui relaxed divided items'></div>");
             var resultsArray = resultSet.results;
             for (var i = 0, len = resultsArray.length; i < len; i++) {
                 tempDomItem = this._buildResultItem(resultsArray[i]);
                 tempDomItem.appendTo(listRoot);
             }
             
             this._container.find(".items").append(listRoot.children(".item"));
             
             // Supprimer le bouton "Plus de résultats".
             this._container.find("button.more-results").remove();
             this._container.find("div.message").remove();
             
             if (resultSet.warningMessage === resultSet.WARNING_MESSAGE.TOO_MUCH_RESULTS) {
                 $("<div class='ui icon info message'><i class='warning icon'></i><div class='content'><div class='header'>Trop de réponses.</div><p>Merci d'affiner votre recherche.</p></div></div>")
                     .appendTo(this._container);
             } else {
                 // S'il existe des résultats non encore affichés, insérer le bouton "Plus de résultats"
                 if (this._dataProvider.moreResultsAvailable()) {
                    $("<button class='fluid ui button more-results'>Plus de résultats</button>").appendTo(this._container); 
                 }
             }
             
             // Mettre à jour les statistiques de recherche
             this._setStats(this._currentTotalResults);
         },
         
         /*
         _askForThumbnailUrl: function() {
             var lastDomItems = this._container.children(".items").last().children(".item");
             
             var isbnArray = [];
             
             lastDomItems.each(
                 function () {
                     isbnArray.push($(this).data("isbn"));
                 }
             );
             
             var gbdp = new GoogleBooksDataProvider();
             var promisedResults = gbdp.getThumbnailsUrl(isbnArray);
             
             promisedResults.done(function( results ) {
               // console.log("_askForThumbnailUrl Results");
               // console.log(results);
                 
                 var tempIsbn = "";
                 var tempUrl = "";
                 var currentItem = null;
                 lastDomItems.each(
                     function () {
                         currentItem = $(this);
                         tempIsbn = currentItem.data("isbn");
                         if ( tempIsbn ) {
                             tempUrl = results[tempIsbn];
                             if ( tempUrl ) {
                                 currentItem.children(".image").children("img").attr("src", tempUrl);
                             }
                         }
                     }
                 );

             });
         },
         */
         
         _clear: function() {
             this._container.children(".items").empty();
             // this._container.children("button.more-results").remove();
             this._container.children(".message").remove();
             //this._currentTotalResults = 0;
             //this._setStats(0);
         }
     };
     
     // Lancement du widget
     new ViafSearchWidget();
    
});