import React from 'react';


interface IProps {
    totalAmount: number;
    totalSum : number;
};

interface IState {};

export default class SimpleSum extends React.PureComponent<IProps, IState> {

    constructor(props: IProps) {
        super(props);

    }

    render() {
        return (
            <tr className="sum">
                    <td>All Products</td>
                    <td>Sum of every product =></td>
                    <td>Total Amount: {this.props.totalAmount}</td>
                    <td>Total Price: {this.props.totalSum}</td>
                    <td></td>
                </tr>
        )

    }

}