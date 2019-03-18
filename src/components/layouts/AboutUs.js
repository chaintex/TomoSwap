import React, { Component } from 'react'

class AboutUs extends Component {
  render() {
    return (
        <div className={"about-us"}>
            <div className={"about-us"}>
                <div className={"container"}>
                    <div className={"about-us__header"}>
                        <div className={"about-us__header-who-we-are"}>Our Team</div>
                        <div className={"about-us__header-description"}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In facilisis sollicitudin ultricies. Nam viverra urna quis vulputate pulvinar.</div>
                    </div>
                    <div className={"about-us__container"}>
                        <div className={"about-us__team-members"}>
                            <div className="about-us__team-member aboutus__team-team">
                                <div className="about-us__team-member-avatar aboutus__team-member-avatar--bio">
                                    <img alt={"Mike Le"} src={require("../../assets/images/aboutus/mike_le.jpg")}></img>
                                </div>
                                <div className="about-us__team-member-name">Mike Le</div>
                                <div className="about-us__team-member-title">CEO & Co-Founder</div>
                            </div>
                            <div className="about-us__team-member aboutus__team-team">
                                <div className="about-us__team-member-avatar aboutus__team-member-avatar--bio">
                                    <img alt={"Mark Nguyen"} src={require("../../assets/images/aboutus/mark_nguyen.jpg")}></img>
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
                            <div className={"about-us__header-description"}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In facilisis sollicitudin ultricies. Nam viverra urna quis vulputate pulvinar.</div>
                        </div>
                        <div className={"about-us__container"}>
                            <div className={"about-us__team-members"}>
                                <div className="about-us__team-member aboutus__team-team">
                                    <div className="about-us__team-member-avatar aboutus__team-member-avatar--bio">
                                        <img alt={"Loi Luu"} src={require("../../assets/images/aboutus/loi_luu.jpg")}></img>
                                    </div>
                                    <div className="about-us__team-member-name">Loi Luu</div>
                                    <div className="about-us__team-member-title">CEO & Co-Founder of Kyber Network</div>
                                </div>
                                <div className="about-us__team-member aboutus__team-team">
                                    <div className="about-us__team-member-avatar aboutus__team-member-avatar--bio">
                                        <img alt={"Victor Tran"} src={require("../../assets/images/aboutus/victor_tran.jpg")}></img>
                                    </div>
                                    <div className="about-us__team-member-name">Victor Tran</div>
                                    <div className="about-us__team-member-title">Head of Development & Co-Founder of Kyber Network</div>
                                </div>
                                <div className="about-us__team-member aboutus__team-team">
                                    <div className="about-us__team-member-avatar aboutus__team-member-avatar--bio">
                                        <img alt={"Long Vuong"} src={require("../../assets/images/aboutus/long_vuong.jpg")}></img>
                                    </div>
                                    <div className="about-us__team-member-name">Long Vuong</div>
                                    <div className="about-us__team-member-title">CEO, Co-Founder of TomoChain</div>
                                </div>
                                <div className="about-us__team-member aboutus__team-team">
                                    <div className="about-us__team-member-avatar aboutus__team-member-avatar--bio">
                                        <img alt={"Tu Nguyen"} src={require("../../assets/images/aboutus/tu_nguyen.jpg")}></img>
                                    </div>
                                    <div className="about-us__team-member-name">Tu Nguyen</div>
                                    <div className="about-us__team-member-title">Lead of blockchain engineer TomoChain</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
  }
}

export default AboutUs;
