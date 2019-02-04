import React, {Component} from "react";
import '../css/Slider.css'

export default class Slider extends Component {
    constructor() {
        super();

        this.state = {
            position: 0,
            xValue: 0
        }

        this.prev = this.prev.bind(this);
        this.next = this.next.bind(this);
    }

    prev() {
        if (this.state.position === 0) {
            return;
        }
        else {
            this.setState(prevState => ({
                position: prevState.position - 1,
                xValue: prevState.xValue + this.props.width
            }));
        }
        console.log(this.state)
    }

    next() {
        if (this.state.position === this.props.urls.length -1) {
            this.setState(prevState => ({
                position: 0,
                xValue: 0
            }));
        }
        else {
            this.setState(prevState => ({
                position: prevState.position + 1,
                xValue: prevState.xValue - this.props.width
            }));
        }
    }

    render() {
        console.log(this.state)
        let width = this.props.width;
        let urls = this.props.urls;
        let type = this.props.type;
        let hidden = this.props.hidden ? 'none' : 'block'
        return (
            <div style={{display: hidden}}>
                <div className="slider" style={{width: width}}>
                    <div className="wrapper"
                    style={{
                        width: width,
                        transform: `translateX(${this.state.xValue}px)`,
                        transition: 'transform ease-out 0.45s'
                    }}>
                        {
                        urls.map((url, i) => (
                            <Slide key={i} url={url} width={width} type={type} />
                        ))
                        }
                    </div>

                    <div className="prev-arrow" onClick={this.prev}>◀</div>
                    <div className="next-arrow" onClick={this.next}>▶</div>
                </div>
                <div className="counter">
                    {this.state.position+1} of {urls.length}
                </div>
            </div>
        )
    }
}

const Slide = ({url, width, type}) => {
    if (type === 'video') {
        return <iframe width={width} height="300" src={url} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
    }
    else {
        const styles = {
            width: width,
            backgroundImage: `url(${url})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '50% 60%'
        }
        return <div className="slide" style={styles}></div>
    }
}
