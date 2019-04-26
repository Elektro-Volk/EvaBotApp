import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Panel, ListItem, Button, Link, Group, Div, PullToRefresh, Avatar, PanelHeader, HeaderButton, platform, IOS, Cell, Spinner, View, CellButton, Progress } from '@vkontakte/vkui';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import Icon24Add from '@vkontakte/icons/dist/24/add';

import Pets_Pet from './Pets_Pet';
import Pets_Shelder from './Pets_Shelder';

import { getTimeString } from '../utils.js';

const apieva = require('../apieva');
const osname = platform();

class Pets extends React.Component {
	constructor(props) {
		super(props);

		this.openSheet = this.openSheet.bind(this);
		this.onRefresh = apieva.makeOnRefresh('pets', 'list', {}, this, this.onLoaded.bind(this));
		this.openPet = this.openPet.bind(this);

		this.state = {
			content: null,
            activePanel: "main",
			popout: null,
			fetching: false
		};
     }

	openPet(pet, petType) {
		this.setState({
			activePanel: 'pet',
			petcontent: <Pets_Pet
			   id={pet.id}
			   title={`${petType.smile} ${pet.name}`}
			   close={() => this.setState({ activePanel: 'main' })}
			   openSheet = {(popout) => this.openSheet(popout)}
		   />
		});
	}

     async onLoaded(fetchedUser, pets) {
		 await apieva.initPets();

         let petsHtml = [];
         pets.forEach(pet => {
			 let petType = apieva.getPetType(pet.type);
             let petStats = (<Div style={{display: 'flex', padding: 0, margin: 0}}>
                <Div stretched style={{padding: 10, margin: 0}}>🍗 {pet.hunger}%</Div>
                <Div stretched style={{padding: 10, margin: 0}}>💖 {pet.love}%</Div>
                <Div stretched style={{padding: 10, margin: 0}}>⚡ {pet.energy}%</Div>
              </Div>);

             petsHtml.push(
                 <Cell
                     before={<Avatar>{petType.smile}</Avatar>}
                     size="l"
                     onClick={(e) => {
						 this.setState({
							 activePanel: 'pet',
							 petcontent: <Pets_Pet
							 	id={pet.id}
								title={`${petType.smile} ${pet.name}`}
								close={() => this.setState({ activePanel: 'main' })}
								openSheet = {(popout) => this.openSheet(popout)}
							/>
						 });
					 }}
					 indicator={pet.issleep==0 ? '' : '💤'}
                     description={pet.died==0 ? petStats : `💀 Умер ${getTimeString(pet.died)}.`}
                 >
				 	{pet.name}
                 </Cell>
             );
         });

     	let result = (
     		<Div>
     			<Group>
     				<Link href="https://vk.com/@evarobotgroup-help-pets-app" target="_blank"><Button size="xl" level="outline">Что такое питомцы?</Button></Link>
     			</Group>
     			<Group>
                	{petsHtml}
					<CellButton before={<Icon24Add />} onClick={(e) => {
						this.setState({ activePanel: 'shelder' });
					}}>Завести питомца</CellButton>
     			</Group>
     		</Div>
     	);

     	this.setState({ content: result, fetching: false });
     }

	 openSheet(popout) {
		 this.setState({ popout });
	 }

	render() {
        if(!this.state.content) apieva.cSend('pets', 'list', { petId: this.props.id }, this.props, this.onLoaded.bind(this));

    	return (
            <View id="petsView" activePanel={this.state.activePanel} popout={this.state.popout}>
				<Panel id='main'>
					<PanelHeader>🐾 Мои питомцы</PanelHeader>
					<PullToRefresh onRefresh={this.onRefresh} isFetching={this.state.fetching}>
						{this.state.content ? this.state.content : <Spinner size="large" style={{ marginTop: 20 }} />}
					</PullToRefresh>
				</Panel>
                <Panel id='pet'>{this.state.petcontent}</Panel>
                <Panel id='shelder'><Pets_Shelder
					close={() => this.setState({ activePanel: 'main' })}
					openSheet={this.openSheet.bind(this)}
					openPet={this.openPet}
				/></Panel>
            </View>
    	);
	}
}

Pets.propTypes = {
	id: PropTypes.string.isRequired,
	fetchedUser: PropTypes.shape({
		photo_200: PropTypes.string,
		first_name: PropTypes.string,
		last_name: PropTypes.string
	}),
};

export default Pets;
