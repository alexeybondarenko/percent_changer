import React from 'react';
import { Button, RangeSlider, ResultList } from 'components';
import { filter, getMax, getMin, toRound } from 'helpers';
import styles from './Main.css';

class Main extends React.Component {

    state = {
        items: [
            { name: "Item 1", percent: 0 }
        ] 
    }

    componentDidMount() {
        const sum = this.state.items.reduce((sum, item) => sum + item.percent, 0);
        if ( sum > 100 || sum === 0) {
            this.setState(prevState => {
                const newItems = prevState.items.map((item, index) => {
                    index === 0 ? item.percent = 100 : item.percent = 0;
                    return item;
                })
                return ({ items: newItems });
            })
        }
    }

    _onAddRangeSlider = () => {
        let newItems = this.state.items.slice();
        const sum = newItems.reduce((sum, item) => sum + item.percent, 0);
        newItems.push({ name: `Item ${newItems.length + 1}`, percent: 100 - sum });
        this.setState({ items: newItems });
    }

    _onDeleteRangeSlider = () => {
        if (this.state.items.length === 1) return;

        let newItems = this.state.items.slice();
        const removedItem = newItems.pop();
        newItems[0].percent += removedItem.percent;
        this.setState({ items: newItems });
    }

    _distribution = (array, delta) => {
        if (array.length === 0) return;

        let currentItem = (delta > 0) ? getMax(array) : getMin(array)
        const diff = currentItem.percent - delta;

        if (diff < 0) {
            currentItem.percent = 0;
            this._distribution(filter(array, currentItem), Math.abs(diff));
        } else {
            currentItem.percent = toRound(currentItem.percent - delta);
        }
    }

    _onChange = (key, value) => {
        this.setState(prevState => {
            const newItems = prevState.items.slice();
            let currentItem = newItems[key];
            const otherItems = filter(newItems, currentItem);

            if (otherItems.length > 0) {
                const delta = toRound(value - currentItem.percent);
                this._distribution(otherItems, delta);
            }

            currentItem.percent = Number(value);
            otherItems.splice(key, 0, currentItem);
            return ({ items: otherItems });
        }) 
    }

    render() {
        const { items } = this.state;

        return (
            <div className={styles.grid}>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <Button title='ADD' color='#0d9a59' onClick={this._onAddRangeSlider} />
                        <Button title='DELETE' color='#DD3E3E' onClick={this._onDeleteRangeSlider} />
                    </div>
                    {items.map((item, index) => {
                        return (
                            <RangeSlider 
                                key={index} 
                                layout={styles.slider} 
                                percent={item.percent} 
                                name={item.name} 
                                index={index} 
                                onChange={this._onChange} 
                            />
                        )}
                    )}
                    <ResultList items={items} />
                </div>
            </div>
        );
    }
}

export default Main;