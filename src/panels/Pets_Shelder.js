import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Panel, ListItem, ActionSheetItem, ActionSheet, ScreenSpinner, Button, List, Alert, Link, Group, Div, PullToRefresh, Avatar, PanelHeader, HeaderButton, platform, IOS, Cell, Spinner, View, CellButton, Progress } from '@vkontakte/vkui';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';

import { getTimeString } from '../utils.js';

const apieva = require('../apieva');
const osname = platform();

class Pets_Shelder extends React.Component {
    constructor(props) {
		super(props);

        this.state = { };
    }

    getPets(petType) {
        this.props.openSheet(<ScreenSpinner />);
        apieva.send('pets', 'listFree', { petType: petType.id }).then((response) => {
            let petList = response.data.map(pet => <ActionSheetItem autoclose onClick={() => this.props.openPet(pet, petType)}>{pet.name}</ActionSheetItem>);
            this.props.openSheet(
                <ActionSheet onClose={() => this.props.openSheet(null)}>
                    {petList}
                    {osname === IOS && <ActionSheetItem autoclose theme="cancel">Закрыть</ActionSheetItem>}
                </ActionSheet>
            );
        });
    }

	render() {
        let petTypeList = apieva.getPetTypes().map(type => (
            <ListItem>
                <Cell
                    before={<Avatar>{type.smile}</Avatar>}
                    onClick={() => this.getPets(type)}
                >{type.mname}</Cell>
            </ListItem>
        ))

    	return (
            <Div>
                <PanelHeader left={<HeaderButton onClick={this.props.close}>{osname === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}</HeaderButton>}>
                    🐶 Приют питомцев
                </PanelHeader>
                <Group title="Список доступных видов"><List>{petTypeList}</List></Group>
            </Div>
    	);
	}
}

Pets_Shelder.propTypes = {
	fetchedUser: PropTypes.shape({
		photo_200: PropTypes.string,
		first_name: PropTypes.string,
		last_name: PropTypes.string
	}),
};

export default Pets_Shelder;
