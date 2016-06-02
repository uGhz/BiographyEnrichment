<!DOCTYPE html>
<html>
<head>
<!-- Standard Meta -->
<meta charset="utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta name="viewport"
	content="width=device-width, initial-scale=1.0, maximum-scale=1.0">

<!-- Site Properties -->
<title>Biography Enrichment - BIU Santé</title>

<link rel="stylesheet" type="text/css"
	href="Semantic-UI-CSS-master/dist/semantic.min.css">

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
			<a href="#" class="header item"> <img class="logo"
				src="images/logo.png"> Biography Enrichment
			</a> <a href="#" class="item">Home</a>
			<div class="ui simple dropdown item">
				Dropdown <i class="dropdown icon"></i>
				<div class="menu">
					<a class="item" href="#">Link Item</a> <a class="item" href="#">Link
						Item</a>
					<div class="divider"></div>
					<div class="header">Header Item</div>
					<div class="item">
						<i class="dropdown icon"></i> Sub Menu
						<div class="menu">
							<a class="item" href="#">Link Item</a> <a class="item" href="#">Link
								Item</a>
						</div>
					</div>
					<a class="item" href="#">Link Item</a>
				</div>
			</div>
		</div>
	</div>

	<div class="ui main container">
		<h1 class="ui header">Semantic UI Fixed Template</h1>
		<p>This is a basic fixed menu template using fixed size containers.</p>
		<p>A text container is used for the main container, which is useful
			for single column layouts</p>

		<div class="ui grid">

			<div class="eight wide column">
				<div class="row">
					<div class="ui segment">
						<h2 class="ui header">
							<img class="ui image"
								src="http://www.biusante.parisdescartes.fr/ressources/images/logo-biusante-officiel.png">
							<div class="content">
								Biographies
								<div class="sub header">Powered by La BIU Santé</div>
							</div>
						</h2>
						<div class="ui fluid search">
							<div class="ui fluid icon input">
								<input class="prompt" type="text" placeholder="Chercher..."> <i
									class="search icon"></i>
							</div>
							<div class="results"></div>
						</div>
					</div>
				</div>
				  <div class="ui horizontal divider">
				    Ou
				  </div>


				<form id="viafSearchForm" class="ui form segment">
					<div class="field">
						<label>Saisissez un identifiant VIAF&nbsp;:</label> <input
							id="viaf-id" type="text" placeholder="96994048">
					</div>
					<button type="submit" class="ui submit button">Chercher</button>
				</form>

				<div id="viafSearchResults" class="ui segment"></div>

				<div id="viafOtherNamesContainer" class="ui segment"></div>
			</div>

			<div class="eight wide column">

				<div class="ui grid">

					<div class="two column row">

						<div class="column" id="wikidataImageContainer">

							<!-- Placeholder for Wikidata Image -->

						</div>
						<div class="column" id="biusanteImageContainer">
							<div class="ui card">
								<div class="content">
									<img class="left floated mini ui image"
										src="http://www.biusante.parisdescartes.fr/ressources/images/logo-biusante-officiel.png">
									<div class="header">Images et portraits</div>
								</div>
								<div class="image">
									<img
										src="https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Augustin_Grisolle.jpg&amp;width=300">
								</div>
								<div class="content">
									<a class="header">My title</a>
									<div class="meta">
										<span class="date">Joined in 2013</span>
									</div>
									<div class="description">My short description.</div>
								</div>
								<div class="extra content">
									<a> <i class="user icon"></i> 22 Friends
									</a>
								</div>
							</div>
						</div>

						<div class="column" id="wikipediaLinksContainer">

							<!-- Placeholder for Wikipedia Links -->

						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="ui divider"></div>
		<span><i class="copyright icon"></i> Gupta 2016</span>
	</div>

	<div class="ui inverted vertical footer segment">
		<div class="ui center aligned container">
			<div class="ui stackable inverted divided grid">
				<div class="three wide column">
					<h4 class="ui inverted header">Group 1</h4>
					<div class="ui inverted link list">
						<a href="#" class="item">Link One</a> <a href="#" class="item">Link
							Two</a> <a href="#" class="item">Link Three</a> <a href="#"
							class="item">Link Four</a>
					</div>
				</div>
				<div class="three wide column">
					<h4 class="ui inverted header">Group 2</h4>
					<div class="ui inverted link list">
						<a href="#" class="item">Link One</a> <a href="#" class="item">Link
							Two</a> <a href="#" class="item">Link Three</a> <a href="#"
							class="item">Link Four</a>
					</div>
				</div>
				<div class="three wide column">
					<h4 class="ui inverted header">Group 3</h4>
					<div class="ui inverted link list">
						<a href="#" class="item">Link One</a> <a href="#" class="item">Link
							Two</a> <a href="#" class="item">Link Three</a> <a href="#"
							class="item">Link Four</a>
					</div>
				</div>
				<div class="seven wide column">
					<h4 class="ui inverted header">Footer Header</h4>
					<p>Extra space for a call to action inside the footer that could
						help re-engage users.</p>
				</div>
			</div>
			<div class="ui inverted section divider"></div>
			<img src="images/logo.png" class="ui centered mini image">
			<div class="ui horizontal inverted small divided link list">
				<a class="item" href="#">Site Map</a> <a class="item" href="#">Contact
					Us</a> <a class="item" href="#">Terms and Conditions</a> <a
					class="item" href="#">Privacy Policy</a>
			</div>
		</div>
	</div>

	<script id="empty-results-area-template"
		type="mustache/x-tmpl-mustache">
        <div class="ui dimmable">
                    <h2 class="ui header"><i class="{{iconName}} icon"></i>
                        <div class="content">
                            {{title}}
                            {{#subtitle}}
                            <div class="sub header">{{&subtitle}}</div>
                            {{/subtitle}}
                        </div>
                    </h2>

            <div class="ui inverted dimmer">
                <div class="ui text loader">Interrogation de VIAF...</div>
            </div>
            <table class="ui fixed compact table"><tbody></tbody></table>
        </div>
    </script>

	<script id="pair-item-template" type="mustache/x-tmpl-mustache">
        <tr>
			<td>{{ label }}</td>
			<td> 
                    {{ #value.length }}
                    <div class="ui list">
                    {{ #value }}
                        <div class="item">
                            <div class="content">
                               {{ . }}
                            </div>
                        </div>
                    {{ /value }}
                    </div>
                    {{ /value.length }}    
			</td>
        </tr>
    </script>

	<script id="image-card-template" type="mustache/x-tmpl-mustache">
							<div class="ui card">
								<div class="content">
									<img class="left floated mini ui image" src="{{ cardLogoUrl }}">
									<div class="header">{{ cardTitle }}</div>
								</div>
								<div class="image">
									<img src="{{ imageUrl }}">
								</div>
								<div class="content">
									<a class="header">{{ title }}</a>
									<div class="meta">
										<span class="date">Joined in 2013</span>
									</div>
									<div class="description">{{ description }}</div>
								</div>
								<div class="extra content">
									<a> <i class="user icon"></i> 22 Friends
									</a>
								</div>
							</div>
    </script>


	<script id="wikipedia-links-template" type="mustache/x-tmpl-mustache">
<div class="ui segment">

<h2 class="ui header">
	<i class="student icon"></i>
    <div class="content">
        Wikipedia Links
        <div class="sub header">En provenance de viaf.org</div>
    </div>
</h2>

{{ #links.length }}
<div class="ui middle aligned divided list">
  {{ #links }}
  <div class="item">
    <img class="ui avatar image" src="https://upload.wikimedia.org/wikipedia/commons/6/63/Wikipedia-logo.png">
    <div class="content">
      <a class="header" href="{{ url }}">{{ label }}</a>
    </div>
  </div>
  {{ /links }}
</div>
{{ /links.length }}
</div>
    </script>

	<script id="other-names-template" type="mustache/x-tmpl-mustache">
<div class="ui segment">

<h2 class="ui header">
	<i class="student icon"></i>
    <div class="content">
        Other Names
        <div class="sub header">En provenance de viaf.org</div>
    </div>
</h2>

{{ #value.length }}
<div class="ui middle aligned divided list">
  {{ #value }}
  <div class="item">
    <div class="content">
      <span class="header">{{ . }}</span>
    </div>
  </div>
  {{ /value }}
</div>
{{ /value.length }}
</div>
    </script>
    
    
	<?php include "data/referentiel.php"?>
	<script src="mustache/mustache.min.js"></script>
	<script src="js/biography-specific.js"></script>
</body>

</html>