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
            <div className="main">
                <header>
                    <h1>Eduardo's Challenge</h1>
                </header>
                <div className="data">
                    <textarea
                        onChange={this.handleChange}
                        value={this.state.value}
                        cols="30" 
                        rows="10" 
                        placeholder="Paste here your input..." />
                    <p> chart under construction... </p>
                </div>
                <footer>
                    <input
                        className="button"
                        type="button"
                        value="GENERATE CHART"
                        onClick={this.handleClick} />
                </footer>
            </div>
        );
    }
}

export default App