import React from 'react';
import { Card, CardBody, CardHeader, CardText, CardTitle, Container } from 'reactstrap';
import './AllProjects.css';
import axios from 'axios';
import Constants from '../../../utils/constants';


class AllProjects extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			allProjCards: []
		}
	}

	componentDidMount() {
		axios.get(`${Constants.BACKEND_SERVER.URL}/users/project/all`)
			.then((response) => {
				
				if (response.data != null) {

					var projectCards = [],
						item
					for (var index in response.data) {
						item = response.data[index]
						// console.log(item)
						projectCards.push(
							<a href={`/tester/project/view/${item['_id']}`} className="text-decoration-none text-dark">
								<Card className="card">
									<CardHeader>{item['name']}</CardHeader>
									<CardBody>
										<CardTitle><b>About</b> {item['shortDescription']}</CardTitle>
										<CardText><b>Technologies</b> {item['technologies']}</CardText>
										<CardText><b>Detailed Description</b> {item['detailedDescription']}</CardText>
										<CardText><b>Company Name</b> {item['companyName']}</CardText>
										<CardText><b>Address</b> {item['address']}</CardText>
										<CardText><b>City</b> {item['city']}</CardText>
										<CardText><b>State</b> {item['state']}</CardText>
										<CardText><b>Zipcode</b> {item['zip']}</CardText>
										<CardText><b>TestCases</b> {item['testCases']}</CardText>
									</CardBody>
								</Card>
							</a>
						)
					}

					this.setState({
						allProjCards: projectCards
					})
				}
			})
			.catch(() => { console.log("error") })

	}

	render() {
		return (
			<div className="mainDiv">
				<div className="navDiv">
				</div>
				<div style={{ marginTop: "1%" }}>
					{/* <Jumbotron>
						<Container>
							<span style={{ marginLeft: "2px" }}> <h4 className="display-4">My Projects</h4></span>
							<span class="right-button"><a href="/addProject"> <Button color="danger"> Add</Button></a></span>
						</Container>
					</Jumbotron> */}
					<div>
						<div class="card-arrange">
							<Container>
								{ this.state.allProjCards }
							</Container>
						</div>
					</div>
				</div>
			</div>
		);
	}
}




export default AllProjects;