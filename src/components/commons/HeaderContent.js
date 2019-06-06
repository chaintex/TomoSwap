import React, { Component, Fragment } from "react"
import { withLocalize } from 'react-localize-redux';
import NotifyView from './NotifyView'

class HeaderContent extends Component {
    constructor(props) {
        super(props);
    
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside, false);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside, false);
    }

    setWrapperRef(node) {
        this.wrapperRefs = this.wrapperRefs || [];
        this.wrapperRefs.push(node);
    }

    handleClickOutside(event) {
        if (this.props.isShowing && this.wrapperRefs) {
            let isClickInside = false;
            for (let index = 0; index < this.wrapperRefs.length; index++) {
                const element = this.wrapperRefs[index];
                if (element.contains(event.target)) {
                    isClickInside = true;
                    break;
                }
            }

            if (!isClickInside) {
                this.props.handleToggleMobileMenu();
            }
        }
    }
    
    handleClickXClose() {
        this.props.handleToggleMobileMenu();
    }
    
    render() {
        const props = this.props;
        const aTarget = props.isTomoWallet ? "_self" : "_blank";
        return (
            <Fragment>
                <NotifyView className={`mobile-notify`} txs={props.txs} />
                <div ref={this.setWrapperRef} className={"header__mobile-opener"} onClick={() => this.handleClickXClose()}>
                    <div className={"header__mobile-opener-bar"}/>
                    <div className={"header__mobile-opener-bar"}/>
                </div>
                <div ref={this.setWrapperRef} className={"header__content"}>
                    <a href="#exchange" onClick={() => this.handleClickXClose()} className={"header__content-item active"}>{props.translate(`components.layouts.Header.Swap`)}</a>
                    {!props.isTomoWallet && (
                        <a href="#aboutus" onClick={() => this.handleClickXClose()} className={"header__content-item"}>{props.translate(`components.layouts.Header.About_Us`)}</a>
                    )}
                    {/* <a href="http://bit.ly/316hlfq" target={aTarget} rel="noopener noreferrer" className={"header__content-item"}>{props.translate(`components.layouts.Header.FAQ`)}</a> */}
                    <a href="https://goo.gl/forms/PPgKR2d6A5KtV7tH2" target={aTarget} rel="noopener noreferrer" className={"header__content-item"}>
                    {props.translate(`components.layouts.Header.Contact_Us`)}
                    </a>
                    <a href="https://medium.com/@tomoswap" target={aTarget} rel="noopener noreferrer" className={"header__content-item"}>
                    {props.translate(`components.layouts.Header.Blog`)}
                    </a>
                    <div className={"header__content-item header__content-lang"}>
                        <span>{props.name}</span>
                        <div className="common__arrow-drop-down down language_arrow"></div>
                        <div className="header__content-lang-langswitch langswitch">
                        {props.getLanguages}
                        </div>
                    </div>
                    <NotifyView txs={props.txs} />
                </div>
            </Fragment>
        )
    }
}

export default withLocalize(HeaderContent)