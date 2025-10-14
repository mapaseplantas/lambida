function desenharMenu(){
	const menuBox = "\
	<a href=\"./projeto.html\">SOBRE O PROJETO</a>\
	<hr>\
	<a href=\"./equipe.html\">NOSSA EQUIPE</a>\
	<hr>\
	<a href=\"https://www.instagram.com/projetolambida\">INSTAGRAM</a>";
	
	menuElement = document.getElementById("menu");
	
	document.getElementById("menu").classList.toggle("hide");
	if(menuElement.childElementCount === 0){
		menuElement.innerHTML = menuBox;
	} else{
		menuElement.innerHTML = "";
	}
	// todo: fazer não ficar clicavel e selecionavél (talvez mudar o HTML)
}