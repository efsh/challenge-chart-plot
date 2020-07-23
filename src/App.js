import React from 'react';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleClick(event) {
        console.log(this.state.value);
        event.preventDefault();
    }


    render() {
        return (
            <div>
                <div className="input-data">
                    <textarea
                        onChange={this.handleChange}
                        value={this.state.value}
                        cols="30" 
                        rows="10" />
                </div>
                <div className="chart">
                    <p>-- chart -- </p>
                </div>
                <div className="execute">
                <input
                    type="button"
                    value="GENERATE CHART"
                    onClick={this.handleClick} />
                </div>
            </div>
        );
    }
}

export default App