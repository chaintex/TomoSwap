import React, { Component } from 'react'
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
                            <div className={"about-us__header-who-we-are"}>Our Team</div>
                            <div className={"over"}></div>
                        </div>
                        <div className={"about-us__container"}>
                            <div className={"about-us__team-members"}>
                                <div className="about-us__team-member about-us__team-team">
                                    <div className="about-us__team-member-avatar about-us__team-member-avatar--bio"
                                        data-title={"Mike Le"}
                                        data-sub-title={"CEO & Co-Founder"}
                                        data-bio={"Mike Le is an experienced developer with strong knowledge in competitive programming, data structures and CS fundamentals. He achieved Bronze Medal in the International Olympics of Information (IOI) in 2013 and was offered the ASEAN scholarship by National University of Singapore (NUS). He represented NUS to compete at the ACM/ICPC World Final in Beijing 2018, which is one of the biggest annual competition for programming students all over the world. In 2017, Mike co-founded (& CTO) Spence Pay which was a mobile payment service and successfully launched in NUS. Mike graduated from NUS with Honors in 2018 and since then, he has been working with blockchain technology, especially Ethereum."}
                                        data-img={require("../../assets/images/aboutus/mike_le.png")}
                                        style={{backgroundImage: "url(" + require("../../assets/images/aboutus/mike_le.png") + ")"}}
                                        onClick={this.bioDetailClick.bind()}
                                        >
                                    </div>
                                    <div className="about-us__team-member-name">Mike Le</div>
                                    <div className="about-us__team-member-title">CEO & Co-Founder</div>
                                </div>
                                <div className="about-us__team-member about-us__team-team">
                                    <div className="about-us__team-member-avatar about-us__team-member-avatar--bio"
                                        data-title={"Mark Nguyen"}
                                        data-sub-title={"Full Stack Engineer"}
                                        data-bio={"Mark Nguyen is a well-known programmer with dozens of years of experience working in large corporations such as CMC, FPT. At Co-Well Co., LTD, as a Project Manager for Finance and Banking solutions for the Japanese market, he has successfully deployed hundreds of projects."}
                                        data-img={require("../../assets/images/aboutus/mark_nguyen.jpg")}
                                        style={{backgroundImage: "url(" + require("../../assets/images/aboutus/mark_nguyen.jpg") + ")"}}
                                        onClick={this.bioDetailClick.bind()}
                                        >
                                    </div>
                                    <div className="about-us__team-member-name">Mark Nguyen</div>
                                    <div className="about-us__team-member-title">Full Stack Engineer</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={"about-us advisor"}>
                        <div className={"container"}>
                            <div className={"about-us__header"}>
                                <div className={"about-us__header-who-we-are"}>Our Advisors</div>
                            </div>
                            <div className={"about-us__container"}>
                                <div className={"about-us__team-members"}>
                                    <div className="about-us__team-member about-us__team-team">
                                        <div className="about-us__team-member-avatar about-us__team-member-avatar--bio"
                                            data-title={"Loi Luu"}
                                            data-sub-title={"CEO & Co-Founder of Kyber Network"}
                                            data-bio={"Loi Luu is a researcher working on cryptocurrencies, smart contract security and distributed consensus algorithms. He is also a regular invited speaker at Bitcoin and Ethereum workshops such as DevCon2, EDCON. Loi believes in the force of the Ethereum and Blockchain technology. Much of his work revolves around this community. He developed Oyente, the first open-source security analyzer for Ethereum smart contracts. Loi also cofounded SmartPool, another open source project which embraces decentralization of mining pools in existing cryptocurrency. He continues to champion decentralisation and trustless properties of the Blockchain with KyberNetwork, taking inspiration and developing value for the community."}
                                            data-img={require("../../assets/images/aboutus/loi_luu.png")}
                                            style={{backgroundImage: "url(" + require("../../assets/images/aboutus/loi_luu.png") + ")"}}
                                            onClick={this.bioDetailClick.bind()}
                                            >
                                        </div>
                                        <div className="about-us__team-member-name">Loi Luu</div>
                                        <div className="about-us__team-member-title">CEO & Co-Founder of Kyber Network</div>
                                    </div>
                                    <div className="about-us__team-member about-us__team-team">
                                        <div className="about-us__team-member-avatar about-us__team-member-avatar--bio"
                                            data-title={"Victor Tran"}
                                            data-sub-title={"Head of Development & Co-Founder of Kyber Network"}
                                            data-bio={"Victor Tran is a senior backend engineer and Linux system administrator. He is experienced in building high performance multi-platform applications. Victor has been involved in blockchain and cryptocurrency development since early 2016 and is a lead engineer at the SmartPool project."}
                                            data-img={require("../../assets/images/aboutus/victor_tran.png")}
                                            style={{backgroundImage: "url(" + require("../../assets/images/aboutus/victor_tran.png") + ")"}}
                                            onClick={this.bioDetailClick.bind()}
                                            >
                                        </div>
                                        <div className="about-us__team-member-name">Victor Tran</div>
                                        <div className="about-us__team-member-title">Head of Development & Co-Founder of Kyber Network</div>
                                    </div>
                                    <div className="about-us__team-member about-us__team-team">
                                        <div className="about-us__team-member-avatar about-us__team-member-avatar--bio"
                                            data-title={"Long Vuong"}
                                            data-sub-title={"CEO, Co-Founder of TomoChain"}
                                            data-bio={"CEO of TomoChain and TomoChain Project Lead, co-founder and the former project lead of very successful NEM blockchain (New Economy Movement). PhD candidate in economics, Massachusetts, U.S"}
                                            data-img={require("../../assets/images/aboutus/long_vuong.jpg")}
                                            style={{backgroundImage: "url(" + require("../../assets/images/aboutus/long_vuong.jpg") + ")"}}
                                            onClick={this.bioDetailClick.bind()}
                                            >
                                        </div>
                                        <div className="about-us__team-member-name">Long Vuong</div>
                                        <div className="about-us__team-member-title">CEO, Co-Founder of TomoChain</div>
                                    </div>
                                    <div className="about-us__team-member about-us__team-team">
                                        <div className="about-us__team-member-avatar about-us__team-member-avatar--bio"
                                            data-title={"Tu Nguyen"}
                                            data-sub-title={"Lead of blockchain engineer TomoChain"}
                                            data-bio={"Seasoned engineer working in Blockchain and Cloud Computing. Authorized Developer of Apache Software Foundation, Cloud Native Computing Foundation. Lead engineer of multiple cloud computing open-source softwares (kubeless, kubeapps, kompose, kubewatch). Master degree in Distributed Systems, Switzerland"}
                                            data-img={require("../../assets/images/aboutus/tu_nguyen.jpg")}
                                            style={{backgroundImage: "url(" + require("../../assets/images/aboutus/tu_nguyen.jpg") + ")"}}
                                            onClick={this.bioDetailClick.bind()}
                                            >
                                        </div>
                                        <div className="about-us__team-member-name">Tu Nguyen</div>
                                        <div className="about-us__team-member-title">Lead of blockchain engineer TomoChain</div>
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

export default AboutUs;
