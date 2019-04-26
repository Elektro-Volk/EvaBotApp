import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Panel, ListItem, Button, View, Group, Div, Textarea, Avatar, PanelHeader, Cell, Spinner, Progress, Link } from '@vkontakte/vkui';
const apieva = require('../apieva');

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function onLoaded(fetchedUser, userProfile) {
	let userInfo = (
		<Cell>
			<Group>
				<Cell
		        	size="l"
		          	description={userProfile.nickname}
		          	before={fetchedUser.photo_200 ? <Avatar src={fetchedUser.photo_200}/> : null}
		        >
		        	{`${fetchedUser.first_name} ${fetchedUser.last_name}`}
		        </Cell>
			</Group>
			<Group>
				<Cell indicator={numberWithCommas(userProfile.balance) + " бит"} description={userProfile.job}>Баланс</Cell>
				<Cell indicator={userProfile.level}>Уровень</Cell>
				<Div><Progress value={userProfile.score/userProfile.maxScore*100} /></Div>
				<Cell indicator={userProfile.role}>Роль</Cell>
			</Group>
		</Cell>
	);

	ReactDOM.render(userInfo, document.getElementById('userInfo'));
	//ReactDOM.render(<Textarea placeholder={userProfile.toString()} />, document.getElementById('userInfo'));
}

const Home = ({ id, fetchedUser }) => {
	if (fetchedUser) apieva.send('profile', 'get').then(response => onLoaded(fetchedUser, response.data));

	return (
        <View activePanel="main">
    		<Panel id='main'>
    			<PanelHeader>👤 Мой профиль</PanelHeader>
    			<Cell id="userInfo">
    				<Spinner size="large" style={{ marginTop: 20 }} />
    			</Cell>
                <Cell>
                    <Group title="Прочее">
                        <Link href="https://vk.com/@evarobotgroup-help-play-app" target="_blank"><Button size="xl" level="outline">Как играть?</Button></Link>
                        <Link href="https://vk.com/evabottp" target="_blank"><Button size="xl" level="outline">Тех. поддержка</Button></Link>
                        <Link href="https://vk.me/join/AAAAACNkOSYHHwx7BXja6x2c" target="_blank"><Button size="xl" level="outline">Официальная беседа бота</Button></Link>
                    </Group>
                </Cell>
    		</Panel>
        </View>
	);
};

Home.propTypes = {
	id: PropTypes.string.isRequired,
	fetchedUser: PropTypes.shape({
		photo_200: PropTypes.string,
		first_name: PropTypes.string,
		last_name: PropTypes.string
	}),
};

export default Home;
