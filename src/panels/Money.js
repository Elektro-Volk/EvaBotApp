import React from 'react';
import PropTypes from 'prop-types';
import {Panel, PanelHeader, HeaderButton, platform, IOS, Group, Cell} from '@vkontakte/vkui';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import connect from '@vkontakte/vkui-connect';
import axios from 'axios';

// eslint-disable-next-line
var user_id = '';
var balance = '';


const osname = platform();
connect.subscribe((e) => {
	switch (e.detail.type) {
		case 'VKWebAppGetUserInfoResult':
			user_id = e.detail.data.id;
			break;
		default:
			console.log(e.detail.type);
	}
});
connect.send('VKWebAppGetUserInfo', {});
// eslint-disable-next-line
axios.get('/evainfo.php?id=1' + user_id).then(response => {
	console.log(response);
	balance = response;
});

const Money = ({id, go, fetchedUser}) => (
	<Panel id={id}>
	{fetchedUser &&
		<PanelHeader
			left={<HeaderButton onClick={go} data-to="home">
				{osname === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
			</HeaderButton>}
		>
			Ваш счёт
		</PanelHeader>}
    <Group title="Информация о Вашем личном счёте">
				<Cell id="balance">
					Баланс: {balance}
				</Cell>
		</Group>
		<Group title="Информация о Вашем банковском счёте">
				<Cell>
					Баланс:
				</Cell>
		</Group>
	</Panel>
);


Money.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
	fetchedUser: PropTypes.shape({
		id: PropTypes.string,
		photo_200: PropTypes.string,
		first_name: PropTypes.string,
		last_name: PropTypes.string,
		city: PropTypes.shape({
			title: PropTypes.string,
		}),
	}),
};

export default Money;
