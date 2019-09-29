import React, {Component} from "react"; 
import HeaderComponent from "../../HeaderComponent"; 

class ProfileView extends Component { 

    constructor(props) 
    { 
        super(props); 
    } 

    render() 

    { 
        return( 
        <div> 
            <HeaderComponent /> 
            <main role="main" class="container margin-after-header"> 
                    <div class="bg-white rounded shadow-sm">
                        <div class="media  pt-3"> 
                            {/* text-muted */} 
                            <div class="p-1 ml-4 bg-secondary rounded-circle"> 
                                <svg 
                                        class="bd-placeholder-img  rounded-circle border border-secondary" 
                                        width="128" 
                                        height="128" 
                                        xmlns="https://image.flaticon.com/icons/svg/145/145842.svg" 
                                        preserveAspectRatio="xMidYMid slice" 
                                        focusable="false" 
                                        role="img" 
                                        aria-label="Placeholder: 32x32" 
                                    > 
                                        <title>Placeholder</title> 
                                        <rect fill="#007bff" width="100%" height="100%" /> 
                                        <text fill="#007bff" dy=".3em" x="50%" y="50%"> 
                                            128x128 
                                        </text> 
                                </svg> 
                            </div> 
                            <div class="md-2 p-3 font-weight-bold ml-3 "> 
                                {/* {this.props.user.firstName} {this.props.user.lastName}*/} 
                                <h1>firstName lastName</h1> 
                            </div> 
                        </div> 

                    <div> 
                    <table class="table my-3">    
                            <thead class="thead-dark"> 
                                <tr> 
                                <th scope="col" style={{width:"33%"}}></th> 
                                <th scope="row" colspan="2" style={{textAlign:"center"}}>Информация</th> 
                                <th scope="col" style={{width:"33%"}}></th> 
                                </tr> 
                            </thead> 

                            <tbody> 
                            <tr> 
                                <td class="font-weight-bold">Дата регистрации:</td> 
                                <td colspan="2"></td> 
                                <td>10.10.10 10/10/10</td> 
                                {/* {this.props.user.createdTime} */} 
                                </tr> 
                                <tr> 
                                <td class="font-weight-bold">Email:</td> 
                                <td colspan="2"></td> 
                                <td>@autizm.com</td> 
                                {/* {this.props.user.email} */} 
                                </tr> 
                                <tr> 
                                <td class="font-weight-bold">Группы:</td> 
                                <td colspan="2"></td> 
                                <td>1,2,3</td> 
                                {/* */} 
                                </tr> 
                            </tbody> 

                        </table> 
                    </div> 
                </div>
            </main> 
        </div> 
        ); 
    } 
} 

export default ProfileView; 