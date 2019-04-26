import React from 'react';
import connect from '@vkontakte/vkui-connect';
import { View, Epic, Tabbar, TabbarItem } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Icon24User from '@vkontakte/icons/dist/24/user'; // Профиль
import Icon24Bug from '@vkontakte/icons/dist/24/bug'; // Питомцы

import Home from './panels/Home';
import Pets from './panels/Pets';
/**
import Persik from './panels/Persik';
import Money from './panels/Money';
*/

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			activeStory: 'main',
			fetchedUser: null,
		};
		this.onStoryChange = this.onStoryChange.bind(this);
     }

	 parseQueryString = (string) => {
	   return string.slice(1).split('&')
		   .map((queryParam) => {
			   let kvp = queryParam.split('=');
			   return {key: kvp[0], value: kvp[1]}
		   })
		   .reduce((query, kvp) => {
			   query[kvp.key] = kvp.value;
			   return query
		   }, {})
   };


     onStoryChange (e) {
       this.setState({ activeStory: e.currentTarget.dataset.story })
     }


	componentDidMount() {
		connect.subscribe((e) => {
			switch (e.detail.type) {
				case 'VKWebAppGetUserInfoResult':
					this.setState({ fetchedUser: e.detail.data });
					break;
				default:
					console.log(e.detail.type);
			}
		});
		connect.send('VKWebAppGetUserInfo', {});
	}

	getItem = (tag, name, icon) => {
		return (
			<TabbarItem
	        	onClick={this.onStoryChange}
	            selected={this.state.activeStory === tag}
	            data-story={tag}
	            text={name}
	        >{icon}</TabbarItem>
  		);
	};

	render() {
		return (
      		<Epic activeStory={this.state.activeStory} tabbar={
        		<Tabbar>
					{this.getItem("main", "Профиль", <Icon24User />)}
					{this.getItem("pets", "Питомцы", <Icon24Bug />)}
        		</Tabbar>
      		}>
        		<Home id="main" fetchedUser={this.state.fetchedUser}/>
        		<Pets id="pets" fetchedUser={this.state.fetchedUser} />
      		</Epic>
  		);
	}
}

export default App;
