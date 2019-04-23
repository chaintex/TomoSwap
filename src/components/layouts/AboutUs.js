import React, { Component } from 'react'
import { withLocalize } from 'react-localize-redux';
import Modal from "../../components/commons/Modal";

class AboutUs extends Component {
    constructor(props) {
        super(props);
        this.state = {
          isActive: false,
          title: '',
          subTitle: '',
          content: '',
          srcImg: ''
        };
    }

    bioDetailClick = e => {
        console.clear();
        this.setState({
            title: e.target.attributes["data-title"].value,
            subTitle: e.target.attributes["data-sub-title"].value,
            srcImg: e.target.attributes["data-img"].value,
            content: e.target.attributes["data-bio"].value,
            isActive: true
        });
    }

    handleClose = () => {
        this.setState({
            isActive: false
        });
    }

    render() {
        return (
            <div id={"aboutus"}>
                <div className={"about-us"}>
                    <div className={"container"}>
                        <div className={"about-us__header"}>
                            <div className={"about-us__header-who-we-are"}>{this.props.translate("components.layouts.AboutUs.Our_Team")}</div>
                            <div className={"over"}></div>
                        </div>
                        <div className={"about-us__container"}>
                            <div className={"about-us__team-members"}>
                                <div className="about-us__team-member about-us__team-team">
                                    <div className="about-us__team-member-avatar about-us__team-member-avatar--bio"
                                        data-title={this.props.translate("components.layouts.AboutUs.Mike_Le.Title")}
                                        data-sub-title={this.props.translate("components.layouts.AboutUs.Mike_Le.Sub_Title")}
                                        data-bio={this.props.translate("components.layouts.AboutUs.Mike_Le.Bio")}
                                        data-img={require("../../assets/images/aboutus/mike_le.png")}
                                        style={{backgroundImage: "url(" + require("../../assets/images/aboutus/mike_le.png") + ")"}}
                                        onClick={this.bioDetailClick.bind()}
                                        >
                                    </div>
                                    <div className="about-us__team-member-name">{this.props.translate("components.layouts.AboutUs.Mike_Le.Title")}</div>
                                    <div className="about-us__team-member-title">{this.props.translate("components.layouts.AboutUs.Mike_Le.Sub_Title")}</div>
                                </div>
                                <div className="about-us__team-member about-us__team-team">
                                    <div className="about-us__team-member-avatar about-us__team-member-avatar--bio"
                                        data-title={this.props.translate("components.layouts.AboutUs.Nga.Title")}
                                        data-sub-title={this.props.translate("components.layouts.AboutUs.Nga.Sub_Title")}
                                        data-bio={this.props.translate("components.layouts.AboutUs.Nga.Bio")}
                                        data-img={require("../../assets/images/aboutus/nga.jpg")}
                                        style={{backgroundImage: "url(" + require("../../assets/images/aboutus/nga.jpg") + ")"}}
                                        onClick={this.bioDetailClick.bind()}
                                        >
                                    </div>
                                    <div className="about-us__team-member-name">{this.props.translate("components.layouts.AboutUs.Nga.Title")}</div>
                                    <div className="about-us__team-member-title">{this.props.translate("components.layouts.AboutUs.Nga.Sub_Title")}</div>
                                </div>
                                <div className="about-us__team-member about-us__team-team">
                                    <div className="about-us__team-member-avatar about-us__team-member-avatar--bio"
                                        data-title={this.props.translate("components.layouts.AboutUs.Mark_Nguyen.Title")}
                                        data-sub-title={this.props.translate("components.layouts.AboutUs.Mark_Nguyen.Sub_Title")}
                                        data-bio={this.props.translate("components.layouts.AboutUs.Mark_Nguyen.Bio")}
                                        data-img={require("../../assets/images/aboutus/mark_nguyen.jpg")}
                                        style={{backgroundImage: "url(" + require("../../assets/images/aboutus/mark_nguyen.jpg") + ")"}}
                                        onClick={this.bioDetailClick.bind()}
                                        >
                                    </div>
                                    <div className="about-us__team-member-name">{this.props.translate("components.layouts.AboutUs.Mark_Nguyen.Title")}</div>
                                    <div className="about-us__team-member-title">{this.props.translate("components.layouts.AboutUs.Mark_Nguyen.Sub_Title")}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={"about-us advisor"}>
                        <div className={"container"}>
                            <div className={"about-us__header"}>
                                <div className={"about-us__header-who-we-are"}>{this.props.translate("components.layouts.AboutUs.Our_Advisors")}</div>
                            </div>
                            <div className={"about-us__container"}>
                                <div className={"about-us__team-members"}>
                                    <div className="about-us__team-member about-us__team-team">
                                        <div className="about-us__team-member-avatar about-us__team-member-avatar--bio"
                                            data-title={this.props.translate("components.layouts.AboutUs.Loi_Luu.Title")}
                                            data-sub-title={this.props.translate("components.layouts.AboutUs.Loi_Luu.Sub_Title")}
                                            data-bio={this.props.translate("components.layouts.AboutUs.Loi_Luu.Bio")}
                                            data-img={require("../../assets/images/aboutus/loi_luu.png")}
                                            style={{backgroundImage: "url(" + require("../../assets/images/aboutus/loi_luu.png") + ")"}}
                                            onClick={this.bioDetailClick.bind()}
                                            >
                                        </div>
                                        <div className="about-us__team-member-name">{this.props.translate("components.layouts.AboutUs.Loi_Luu.Title")}</div>
                                        <div className="about-us__team-member-title">{this.props.translate("components.layouts.AboutUs.Loi_Luu.Sub_Title")}</div>
                                    </div>
                                    <div className="about-us__team-member about-us__team-team">
                                        <div className="about-us__team-member-avatar about-us__team-member-avatar--bio"
                                            data-title={this.props.translate("components.layouts.AboutUs.Victor_Tran.Title")}
                                            data-sub-title={this.props.translate("components.layouts.AboutUs.Victor_Tran.Sub_Title")}
                                            data-bio={this.props.translate("components.layouts.AboutUs.Victor_Tran.Bio")}
                                            data-img={require("../../assets/images/aboutus/victor_tran.png")}
                                            style={{backgroundImage: "url(" + require("../../assets/images/aboutus/victor_tran.png") + ")"}}
                                            onClick={this.bioDetailClick.bind()}
                                            >
                                        </div>
                                        <div className="about-us__team-member-name">{this.props.translate("components.layouts.AboutUs.Victor_Tran.Title")}</div>
                                        <div className="about-us__team-member-title">{this.props.translate("components.layouts.AboutUs.Victor_Tran.Sub_Title")}</div>
                                    </div>
                                    <div className="about-us__team-member about-us__team-team">
                                        <div className="about-us__team-member-avatar about-us__team-member-avatar--bio"
                                            data-title={this.props.translate("components.layouts.AboutUs.Long_Vuong.Title")}
                                            data-sub-title={this.props.translate("components.layouts.AboutUs.Long_Vuong.Sub_Title")}
                                            data-bio={this.props.translate("components.layouts.AboutUs.Long_Vuong.Bio")}
                                            data-img={require("../../assets/images/aboutus/long_vuong.jpg")}
                                            style={{backgroundImage: "url(" + require("../../assets/images/aboutus/long_vuong.jpg") + ")"}}
                                            onClick={this.bioDetailClick.bind()}
                                            >
                                        </div>
                                        <div className="about-us__team-member-name">{this.props.translate("components.layouts.AboutUs.Long_Vuong.Title")}</div>
                                        <div className="about-us__team-member-title">{this.props.translate("components.layouts.AboutUs.Long_Vuong.Sub_Title")}</div>
                                    </div>
                                    <div className="about-us__team-member about-us__team-team">
                                        <div className="about-us__team-member-avatar about-us__team-member-avatar--bio"
                                            data-title={this.props.translate("components.layouts.AboutUs.Tu_Nguyen.Title")}
                                            data-sub-title={this.props.translate("components.layouts.AboutUs.Tu_Nguyen.Sub_Title")}
                                            data-bio={this.props.translate("components.layouts.AboutUs.Tu_Nguyen.Bio")}
                                            data-img={require("../../assets/images/aboutus/tu_nguyen.jpg")}
                                            style={{backgroundImage: "url(" + require("../../assets/images/aboutus/tu_nguyen.jpg") + ")"}}
                                            onClick={this.bioDetailClick.bind()}
                                            >
                                        </div>
                                        <div className="about-us__team-member-name">{this.props.translate("components.layouts.AboutUs.Tu_Nguyen.Title")}</div>
                                        <div className="about-us__team-member-title">{this.props.translate("components.layouts.AboutUs.Tu_Nguyen.Sub_Title")}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal isActive={!!this.state.isActive} handleClose={() => this.handleClose()} className={"about-us-modal"}>
                    <div className={"modal__header about-us-modal-header"}>
                        <div className={"img"} style={{backgroundImage: "url(" + this.state.srcImg + ")"}}></div>
                        <div className={"title"}>{this.state.title}</div>
                        <div className={"sub-title"}>{this.state.subTitle}</div>
                    </div>
                    <div className={"modal__body"}>
                        <div className={"modal__body-top about-us-modal-body"}>{this.state.content}</div>
                    </div>
                    <div className={"modal__footer common__flexbox common__flexbox--center"}>
                        <div className={"modal__button modal__button--gradient"} onClick={() => this.handleClose()}>Close</div>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default withLocalize(AboutUs);
