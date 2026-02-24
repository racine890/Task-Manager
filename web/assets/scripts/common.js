function printSection() {
	window.print(); // imprime selon les règles définies dans @media print
}

// Ajouter du texte juste après l'impression.
window.onbeforeprint = () => {
	document.getElementById("more").textContent = "This is added";
};

window.onafterprint = () => {
	document.getElementById("more").textContent = "";
};