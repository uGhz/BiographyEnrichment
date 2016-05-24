<?php 
use models\SitemapMetadata;
?>
<html>
<head>
<title>
Sitemap Generator Results
</title>
<style type="text/css">
.notice {
	border-color:red;
	border-width:1px;
	border-style:solid;
}
</style>
</head>
<body>
	<h1>Sitemap Generator Results</h1>
	<div class="notice">
		<table>
			<tr>
				<th>Nom du fichier</th>
				<th>Nombre d'éléments "image"</th>
				<th>Taille du fichier</th>
				<th>Durée de la communication avec FM</th>
				<th>Temps de génération</th>
			</tr>
		<?php 
			foreach ($sitemapMetadataArray as $sitemapMetadata) {
		?>
			<tr>
				<td><?= $sitemapMetadata->fileName ?></td>
				<td><?= $sitemapMetadata->nImageElements ?></td>
				<td><?= $sitemapMetadata->fileSize ?> octet(s).</td>
				<td><?= $sitemapMetadata->fmRequestDuration ?> sec.</td>
				<td><?= $sitemapMetadata->generationDuration ?> sec.</td>
			</tr>
		<?php 
			}
		?>
		</table>
	</div>
</body>
</html>
