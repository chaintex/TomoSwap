import React, { Component } from 'react'

class AboutUs extends Component {
  render() {
    return (
        <div className={"aboutus"}>
            <div className={"aboutus"}>
                <div className={"container"}>
                    <div className={"aboutus__header"}>
                        <div className={"aboutus__header-who-we-are"}>Our Team</div>
                        <div className={"aboutus__header-description"}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In facilisis sollicitudin ultricies. Nam viverra urna quis vulputate pulvinar.</div>
                    </div>
                    <div className={"aboutus__container"}>
                        <div className={"aboutus__team-members"}>
                            <div className="aboutus__team-member aboutus__team-team">
                                <div className="aboutus__team-member-avatar aboutus__team-member-avatar--bio" 
                                    data-bio="..." 
                                    data-modal-id="bio-modal">
                                    <img src={require("../../assets/images/aboutus/mike_le.jpg")}></img>
                                </div>
                                <div className="aboutus__team-member-name">Mike Le</div>
                                <div className="aboutus__team-member-title">CEO & Co-Founder</div>
                            </div>
                            <div className="aboutus__team-member aboutus__team-team">
                                <div className="aboutus__team-member-avatar aboutus__team-member-avatar--bio" 
                                    data-bio="..." 
                                    data-modal-id="bio-modal">
                                    <img src={require("../../assets/images/aboutus/mark_nguyen.jpg")}></img>
                                </div>
                                <div className="aboutus__team-member-name">Mark Nguyen</div>
                                <div className="aboutus__team-member-title">Full Stack Engineer</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"advisor"}>
                    <div className={"container"}>
                        <div className={"aboutus__header"}>
                            <div className={"aboutus__header-who-we-are"}>Our Advisors</div>
                            <div className={"aboutus__header-description"}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In facilisis sollicitudin ultricies. Nam viverra urna quis vulputate pulvinar.</div>
                        </div>
                        <div className={"aboutus__container"}>
                            <div className={"aboutus__team-members"}>
                                <div className="aboutus__team-member aboutus__team-team">
                                    <div className="aboutus__team-member-avatar aboutus__team-member-avatar--bio" 
                                        data-bio="..." 
                                        data-modal-id="bio-modal">
                                        <img src={require("../../assets/images/aboutus/loi_luu.jpg")}></img>
                                    </div>
                                    <div className="aboutus__team-member-name">Loi Luu</div>
                                    <div className="aboutus__team-member-title">CEO & Co-Founder of Kyber Network</div>
                                </div>
                                <div className="aboutus__team-member aboutus__team-team">
                                    <div className="aboutus__team-member-avatar aboutus__team-member-avatar--bio" 
                                        data-bio="..." 
                                        data-modal-id="bio-modal">
                                        <img src={require("../../assets/images/aboutus/victor_tran.jpg")}></img>
                                    </div>
                                    <div className="aboutus__team-member-name">Victor Tran</div>
                                    <div className="aboutus__team-member-title">Lead Engineer & Co-Founder of SmartChainLab</div>
                                </div>
                                <div className="aboutus__team-member aboutus__team-team">
                                    <div className="aboutus__team-member-avatar aboutus__team-member-avatar--bio" 
                                        data-bio="..." 
                                        data-modal-id="bio-modal">
                                        <img src={require("../../assets/images/aboutus/long_vuong.jpg")}></img>
                                    </div>
                                    <div className="aboutus__team-member-name">Long Vuong</div>
                                    <div className="aboutus__team-member-title">CEO, Co-Founder of TomoChain</div>
                                </div>
                                <div className="aboutus__team-member aboutus__team-team">
                                    <div className="aboutus__team-member-avatar aboutus__team-member-avatar--bio" 
                                        data-bio="..." 
                                        data-modal-id="bio-modal">
                                        <img src={require("../../assets/images/aboutus/tu_nguyen.jpg")}></img>
                                    </div>
                                    <div className="aboutus__team-member-name">Tu Nguyen</div>
                                    <div className="aboutus__team-member-title">Lead of blockchain engineer TomoChain</div>
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
