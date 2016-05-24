<!DOCTYPE html>
<html>
<head>
  <!-- Standard Meta -->
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">

  <!-- Site Properties -->
  <title>Biography Enrichment - BIU Santé</title>

  <link rel="stylesheet" type="text/css" href="Semantic-UI-CSS-master/dist/semantic.min.css">

  <style type="text/css">
  body {
    background-color: #FFFFFF;
  }
  .ui.menu .item img.logo {
    margin-right: 1.5em;
  }
  .main.container {
    margin-top: 7em;
  }
  .wireframe {
    margin-top: 2em;
  }
  .ui.footer.segment {
    margin: 5em 0em 0em;
    padding: 5em 0em;
  }
  </style>

	<script src="https://code.jquery.com/jquery-2.2.0.min.js"></script>
    <script src="Semantic-UI-CSS-master/dist/semantic.min.js"></script>
</head>
<body>

  <div class="ui fixed inverted menu">
    <div class="ui container">
      <a href="#" class="header item">
        <img class="logo" src="images/logo.png">
        Biography Enrichment
      </a>
      <a href="#" class="item">Home</a>
      <div class="ui simple dropdown item">
        Dropdown <i class="dropdown icon"></i>
        <div class="menu">
          <a class="item" href="#">Link Item</a>
          <a class="item" href="#">Link Item</a>
          <div class="divider"></div>
          <div class="header">Header Item</div>
          <div class="item">
            <i class="dropdown icon"></i>
            Sub Menu
            <div class="menu">
              <a class="item" href="#">Link Item</a>
              <a class="item" href="#">Link Item</a>
            </div>
          </div>
          <a class="item" href="#">Link Item</a>
        </div>
      </div>
    </div>
  </div>

  <div class="ui main text container">
    <h1 class="ui header">Semantic UI Fixed Template</h1>
    <p>This is a basic fixed menu template using fixed size containers.</p>
    <p>A text container is used for the main container, which is useful for single column layouts</p>
    
    <form id="viafSearchForm" class="ui form">
	  <div class="field">
	    <label>Saisissez un identifiant VIAF&nbsp;:</label>
	    <input type="viaf-id" placeholder="96994048">
	  </div>
	  <div class="ui submit button">Chercher</div>
	</form>
        <div class="ui padded grid">
        <div id="viafSearchResults" class="four column centered row">
           <!--
            <div class="column">
                <h2 class="ui header">Heading</h2>
                <p class="ui segment">Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.</p>
                <button class="ui tiny button m-top-10">View details &raquo;</button>
            </div>
            -->
        </div>
        <div class="row">
            <div class="column">
                <div class="ui divider"></div>
                <span>&copy; Gupta 2015</span>
            </div>
        </div>
    </div>
    
    <img class="wireframe" src="images/wireframe/media-paragraph.png">
    <img class="wireframe" src="images/wireframe/paragraph.png">
    <img class="wireframe" src="images/wireframe/paragraph.png">
    <img class="wireframe" src="images/wireframe/paragraph.png">
    <img class="wireframe" src="images/wireframe/paragraph.png">
    <img class="wireframe" src="images/wireframe/paragraph.png">
    <img class="wireframe" src="images/wireframe/paragraph.png">
  </div>

  <div class="ui inverted vertical footer segment">
    <div class="ui center aligned container">
      <div class="ui stackable inverted divided grid">
        <div class="three wide column">
          <h4 class="ui inverted header">Group 1</h4>
          <div class="ui inverted link list">
            <a href="#" class="item">Link One</a>
            <a href="#" class="item">Link Two</a>
            <a href="#" class="item">Link Three</a>
            <a href="#" class="item">Link Four</a>
          </div>
        </div>
        <div class="three wide column">
          <h4 class="ui inverted header">Group 2</h4>
          <div class="ui inverted link list">
            <a href="#" class="item">Link One</a>
            <a href="#" class="item">Link Two</a>
            <a href="#" class="item">Link Three</a>
            <a href="#" class="item">Link Four</a>
          </div>
        </div>
        <div class="three wide column">
          <h4 class="ui inverted header">Group 3</h4>
          <div class="ui inverted link list">
            <a href="#" class="item">Link One</a>
            <a href="#" class="item">Link Two</a>
            <a href="#" class="item">Link Three</a>
            <a href="#" class="item">Link Four</a>
          </div>
        </div>
        <div class="seven wide column">
          <h4 class="ui inverted header">Footer Header</h4>
          <p>Extra space for a call to action inside the footer that could help re-engage users.</p>
        </div>
      </div>
      <div class="ui inverted section divider"></div>
      <img src="images/logo.png" class="ui centered mini image">
      <div class="ui horizontal inverted small divided link list">
        <a class="item" href="#">Site Map</a>
        <a class="item" href="#">Contact Us</a>
        <a class="item" href="#">Terms and Conditions</a>
        <a class="item" href="#">Privacy Policy</a>
      </div>
    </div>
  </div>
  
     <script id="empty-results-area-template" type="mustache/x-tmpl-mustache">
        <div class="ui column dimmable">
            <div class="ui grid">
                <div class="thirteen wide column">
                    <h2 class="ui header"><i class="{{iconName}} icon"></i>
                        <div class="content">
                            {{title}}
                            {{#subtitle}}
                            <div class="sub header">{{&subtitle}}</div>
                            {{/subtitle}}
                        </div>
                    </h2>
                </div>
                <div class="three wide column">
                    <div class="ui mini right floated statistic">
                        <div class="value">0</div>
                        <div class="label">Résultats</div>
                    </div>
                </div>
            </div>
            <div class="ui inverted dimmer">
                <div class="ui text loader">Interrogation du catalogue...</div>
            </div>
            <div class="ui relaxed divided items"></div>
        </div>
    </script>
  
  
  <script src="mustache/mustache.min.js"></script>
  <script src="js/biography-specific.js"></script>
</body>

</html>