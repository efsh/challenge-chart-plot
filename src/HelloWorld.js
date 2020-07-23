import React from 'react';

const HelloWorld = () => {

    function sayHello() {
        alert('Hello world');
    }

    return (
        <button onClick={sayHello}>Click me!</button>
    );
};

export default HelloWorld;