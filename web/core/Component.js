class Component{
	constructor(selector, id=null, args={}){
		this.selector = selector;
		this.html = "";
		this.args = args;
		this.id = id;
	}

	getChild(childId) {
		let selector = null;
		if(this.id == null)
			selector = document.querySelector(this.selector);
		else
			selector = document.querySelector(`#${this.id}`);
		if (selector) {
			return selector.querySelector(`#${childId}`);
		}
		return null;
	}

	render(){
		let selector = null;
		if(this.id == null)
			selector = document.querySelector(this.selector);
		else
			selector = document.querySelector(`#${this.id}`);

		let selector_html = this.html.replace("@CONTENT", selector.innerHTML);
		selector.innerHTML = selector_html;
	}

	getArgValue(arg){
		let selector = null;
		if(this.id == null)
			selector = document.querySelector(this.selector);
		else
			selector = document.querySelector(`#${this.id}`);

		let obtained = selector.getAttribute(arg);
		return obtained == null ? "" : obtained;
	}
}