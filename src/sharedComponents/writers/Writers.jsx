import React, { Component } from 'react';
import './writers.css';
import WriterService from './../../services/writerService';

export default class Writers extends Component {
    constructor() {
        super();

        this.state = {
            writers: []
        }
    }

    async componentDidMount() {
        const writers = await WriterService.getAllWriters();
        this.setState({writers: writers});
    }

    render() {
        return (
            <div className="writersWrapper">
                <div className="writers">
                        {this.state.writers.map(w => (
                        <div key={w.id} className="writer">
                            <img alt="img" src={"http://localhost:8080/uploads/" + w.image} className="writerPhoto" />
                            <div className="writerInfo">
                                <span className="writerName">{w.name}</span>
                                <span className="writerDescription">{w.description}</span>
                            </div>
                        </div>
                        ))}
                </div>
            </div>
        )
    }
}
