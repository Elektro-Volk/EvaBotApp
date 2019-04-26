import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Panel, ListItem, Alert, Button, Link, PullToRefresh, ScreenSpinner, Group, Div, Textarea, Avatar, PanelHeader, List, HeaderButton, platform, IOS, Cell, Spinner, View, CellButton, Progress } from '@vkontakte/vkui';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';

import persik from '../img/persik.png';
import './Persik.css';

import { getTimeString } from '../utils.js';

const apieva = require('../apieva');
const osname = platform();

class Pets_Pet extends React.Component {
	constructor(props) {
		super(props);

        this.feedAction = apieva.makeAction('pets', 'feed', { petId: this.props.id }, this, this.onLoaded.bind(this));
        this.playAction = apieva.makeAction('pets', 'play', { petId: this.props.id }, this, this.onLoaded.bind(this));
        this.wakeUpAction = apieva.makeAction('pets', 'wakeUp', { petId: this.props.id }, this, this.onLoaded.bind(this));
        this.shelterAction = apieva.makeAction('pets', 'shelter', { petId: this.props.id }, this, this.onLoaded.bind(this));

        this.openRestorePetSheet = this.openRestorePetSheet.bind(this);
        this.onRefresh = this.onRefresh.bind(this);

        this.state = { };
    }

    onRefresh() {
    	this.setState({ fetching: true });
		apieva.cSend('pets', 'get', { petId: this.props.id }, this.props, this.onLoaded.bind(this));
  	}

     openRestorePetSheet() {
         this.props.openSheet(
             <Alert
                actionsLayout="vertical"
                actions={[{
                    title: 'Восстановить',
                    autoclose: true,
                    action: () => apieva.cSend('pets', 'restore', { petId: this.props.id }, this.props, this.onLoaded.bind(this))
                }, {
                    title: 'Отмена',
                    autoclose: true,
                    style: 'cancel'
                }]}
                onClose={() => this.props.openSheet(null)}
            >
                <h2>Восстановить питомца</h2>
                <p>Вы снова сможете любить и ухаживать за ним</p>
            </Alert>
    );
  }


     async onLoaded(fetchedUser, pet) {
         this.isLoaded = true;
        // alert(JSON.stringify(pet))
         if (pet.error) {
             this.props.openSheet(
                <Alert actionsLayout="vertical" actions={[{
                        title: 'Назад',
                        autoclose: true,
                        style: 'cancel'
                    }]}
                    onClose={() => this.props.openSheet(null)}
                >
                    <h2>Произошла ошибка</h2>
                    <p>{pet.error}</p>
                </Alert>
            );

            return;
         }

         await apieva.initPets();
         let petType = apieva.getPetType(pet.type);

         let result = (
            <Div>
    			<Group>
    				<Cell
                        size="l"
                        before={<Avatar>{pet.died==0 ? petType.smile : '💀'}</Avatar>}
                        description={pet.died==0 ? '' : `Умер ${getTimeString(pet.died)}.`}
                        indicator={pet.issleep==0 ? '' : '💤'}
                    >
    		        	{pet.name}
    		        </Cell>
                    {pet.died==0 ? (
                        <Div>
                            {pet.issleep==0 ? (
                                <Div style={{display: 'flex'}}>
                                    <Button size="l" stretched style={{ marginRight: 8 }} onClick={this.playAction}>Поиграть</Button>
                                    <Button size="l" stretched level="secondary" onClick={this.feedAction}>Покормить</Button>
                                </Div>
                            ) : (
                                <Button size="xl" level="outline" onClick={this.wakeUpAction}>Разбудить</Button>
                            )}
                            {pet.owner==0 ? (<Button size="xl" level="outline" onClick={this.shelterAction}>Купить питомца</Button>) : ''}
                        </Div>
                    ) : ''}
    			</Group>
    			<Group title="Информация о питомце">
                    {
                        pet.died==0 ? (
                            <Div>
                				<Cell indicator={pet.hunger + '%'}>Сытость</Cell>
                                <Progress value={Math.min(100, pet.hunger)} />

                                <Cell indicator={pet.love + '%'}>Счастье</Cell>
                                <Progress value={Math.min(100, pet.love)} />

                                <Cell indicator={pet.energy + '%'}>Энергия</Cell>
                                <Progress value={Math.min(100, pet.energy)} />
                            </Div>
                        ) : (
                            <Div>
                                <img className="DiedPet" src={persik} alt="Died pet"/>
                                <Div>
                                    <p>Ваш питомец умер, потому что вы его не кормили.</p>
                                    <CellButton onClick={() => this.openRestorePetSheet()}>Восстановите питомца за 3 000 000 бит.</CellButton>
                                </Div>
                            </Div>
                        )
                    }
    			</Group>
    		</Div>
     	);

     	this.setState({ content: result, fetching: false });
     }

	render() {
        if(!this.state.content) apieva.cSend('pets', 'get', { petId: this.props.id }, this.props, this.onLoaded.bind(this));

    	return (
            <Div>
                <PanelHeader left={<HeaderButton onClick={this.props.close}>{osname === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}</HeaderButton>}>
                    {this.props.title}
                </PanelHeader>
                <PullToRefresh onRefresh={this.onRefresh} isFetching={this.state.fetching}>
                    {this.state.content ? this.state.content : <Spinner size="large" style={{ marginTop: 20 }} />}
                </PullToRefresh>
            </Div>
    	);
	}
}

Pets_Pet.propTypes = {
	title: PropTypes.string.isRequired,
	fetchedUser: PropTypes.shape({
		photo_200: PropTypes.string,
		first_name: PropTypes.string,
		last_name: PropTypes.string
	}),
};

export default Pets_Pet;
