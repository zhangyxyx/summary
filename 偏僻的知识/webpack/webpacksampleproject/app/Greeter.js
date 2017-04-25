import React,{Component} from 'react',
import config form './config.json';

class Greeter extends Component{
	render(){
		return {
			<div>
				{config.greetText}
			</div>
		};
	}
}

export default Greeter