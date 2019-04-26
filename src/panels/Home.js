import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Panel, ListItem, Button, Link, Group, Div, PullToRefresh, Avatar, PanelHeader, HeaderButton, platform, IOS, Cell, Spinner, View, CellButton, Progress } from '@vkontakte/vkui';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';

import { numberWithCommas } from '../utils.js';

const apieva = require('../apieva');
const osname = platform();

class Home extends React.Component {
	constructor(props) {
		super(props);

        this.onRefresh = apieva.makeOnRefresh('profile', 'get', {}, this, this.onLoaded.bind(this));
		this.state = {
			content: null,
            activePanel: "main",
			popout: null,
			fetching: false
		};
     }

    async onLoaded(fetchedUser, userProfile) {
        this.setState({ content: (
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
     	), fetching: false });
     }

	 openSheet(popout) {
		 this.setState({ popout });
	 }

	render() {
        if(!this.state.content && this.props.fetchedUser) apieva.cSend('profile', 'get', {}, this.props, this.onLoaded.bind(this));

        return (
            <View activePanel={this.state.activePanel} popout={this.state.popout}>
				<Panel id='main'>
					<PanelHeader>👤 Мой профиль</PanelHeader>
					<PullToRefresh onRefresh={this.onRefresh} isFetching={this.state.fetching}>
						{this.state.content ? this.state.content : <Spinner size="large" style={{ marginTop: 20 }} />}
					</PullToRefresh>
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
	}
}

Home.propTypes = {
	id: PropTypes.string.isRequired,
	fetchedUser: PropTypes.shape({
		photo_200: PropTypes.string,
		first_name: PropTypes.string,
		last_name: PropTypes.string
	}),
};

export default Home;
