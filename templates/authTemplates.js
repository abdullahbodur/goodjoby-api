class AuthTemplates {

    static resetPassword(resetPasswordUrl){
        return `<h2> Reset Your Password </h2> 
        <p> This <a href= '${resetPasswordUrl}' target='_blank'>link</a> will be expire in 1 hour </p>`;
        
    }
}