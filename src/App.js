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
        event.preventDefault();
        const data = this.state.value;

        // Read line by line and convert to an array
        const dataArray = data.split('\n');
        const size = dataArray.length;

        // Any event out of range [begin, end] will be ignored
        var begin = 0;
        var end = 0;

        var selectNames = [];
        var groupNames = [];
        const splitGroups = /',\s*'/;

        // Object that will be used to plot the chart
        // E.g: data:[{name: "linux chrome min_response_time", dataPoints:[{y: 0.1, x: 1519862400000},{y: 0.2, x: 1519862460000}]}]
        var chart = [];

        // Stop event, will be ignore follow events
        var stop = false;

        var i = 0;
        //  Each line is not a strict JSON format, so we need to parse it
        do {

            // in -> String({type: 'data', timestamp: 1519862400000, os: 'linux', browser: 'chrome', min_response_time: 0.1, max_response_time: 1.3})
            // First, remove curly brackets from string            
            const str = dataArray[i].substring(1, dataArray[i].length - 1);
            // out -> String(type: 'data', timestamp: 1519862400000, os: 'linux', browser: 'chrome', min_response_time: 0.1, max_response_time: 1.3)

            // In a naive way we can split the string by whitespaces but we need care about 'start' type, 
            // because it has whitespaces in 'select' and 'group' types. So we will use the follow regEx: ,\s(?=\w+:)
            // 1 -> ,\s - matches a comma followed by a whitespace
            // 2 -> (?=\w+:) - positive lookahead to make sure that the current position must be followed by 1+ word-characters followed by :
            const regex = /,\s(?=\w+:)/gi;
            const strSplited = str.split(regex);
            // out -> Array["type: 'data'", "timestamp: 1519862400000", "os: 'linux'", "browser: 'chrome'", "min_response_time: 0.1", "max_response_time: 1.3"]

            // Identify the event type. Format -> type: 'value'
            const regexType = /.*?type:\s'([^']*)'/i;
            const type = strSplited[0].replace(regexType, '$1');

            switch (type) {
                case 'start':
                    // in -> Array["type: 'start'", "timestamp: 1519862400000", "select: ['min_response_time', 'max_response_time']", "group: ['os', 'browser']"]
                    const regexGrouping = /(select:\s|group:\s)(\['(.*?)'\])/i;

                    const sel = strSplited[2].replace(regexGrouping, '$3');
                    // out -> String(min_response_time', 'max_response_time)

                    selectNames = sel.split(splitGroups);
                    // out -> Array["min_response_time", "min_response_time"]

                    const gr = strSplited[3].replace(regexGrouping, '$3');
                    // out -> String(os', 'browser)

                    groupNames = gr.split(splitGroups);
                    // out -> Array["os", "browser"]

                    break;
                case 'span':
                    // in -> Array["type: 'span'", "timestamp: 1519862400000", "begin: 1519862400000", "end: 1519862460000"]
                    const regexTime = /(begin:\s|end:\s)(\d+)/i;

                    // in -> String(begin: 1519862400000)
                    begin = parseInt(strSplited[2].replace(regexTime, '$2'));
                    // out -> Integer(1519862400000)

                    // in -> String(end: 1519862460000)
                    end = parseInt(strSplited[3].replace(regexTime, '$2'));
                    // out -> Integer(1519862460000)

                    break;
                case 'data':
                    // in -> Array["type: 'data'", "timestamp: 1519862400000", "os: 'linux'", "browser: 'chrome'", "min_response_time: 0.1", "max_response_time: 1.3"]

                    // Check if this event between [begin, end]
                    const regexTimeStamp = /(timestamp:\s)(\d+)/i;
                    const timeStamp = parseInt(strSplited[1].replace(regexTimeStamp, '$2'));

                    if (timeStamp >= begin && timeStamp <= end) {

                        // Store data from all groups and all selects
                        var dataChart = {
                            name: "",
                            dataPoints: [{
                                y: 0.0,
                                x: 0
                            }]
                        };

                        groupNames.forEach(elementGroup => {
                            strSplited.forEach(elementString => {
                                if (elementString.includes(elementGroup)) {
                                    // os: 'linux'
                                    // browser: 'chrome'
                                    const valueName = elementString.split(': ')[1].replace(/'/g, '');
                                    // linux
                                    // chrome
                                    dataChart.name += valueName + " ";
                                }
                            });
                        });

                        selectNames.forEach(elementSelect =>{
                            strSplited.forEach(elementString => {

                                if (elementString.includes(elementSelect)) {
                                    // min_response_time: 0.1
                                    // max_response_time: 1.3
                                    dataChart.name += elementString.split(': ')[0] + " ";

                                    const y = parseFloat(elementString.split(': ')[1]);
                                    const x = timeStamp;

                                    const dataPoint = {y, x};
                                    dataChart.dataPoints.push(dataPoint);

                                }

                            });
                        });


                        //console.log("name=" + dataChart.name);
                        console.log("dataPoints=" + dataChart.dataPoints);
                    }

                    //TODO: Push 'dataChart' into 'chart'
                   
                    break;
                case 'stop':
                    // in -> Array["type: 'stop'", "timestamp: 1519862460000"]
                    stop = true;
                    console.log('End of processing');
                    break;
                default:
                    console.log(`Sorry, we are out of ${type}`);
            }
            
            i++;

        } while (i < size && !stop);

        //TODO: convert 'chart' to Json format

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
                    <p> plot chart here... </p>
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