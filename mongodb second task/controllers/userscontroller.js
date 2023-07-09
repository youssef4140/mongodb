export const registeration = (req,res,users)=>{
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const {email, password, passwordrepeat} = req.body
    const newuser = {email: email , password: password}
    
    if (emailRegex.test(email) && passwordRegex.test(password) && passwordrepeat === password ){
        if (users.some(user => user.email === email)){
            res.send("email already exists");
        }else {
            users.push(newuser)
            res.send("user added successfully")
            console.log(users)
        }
    }else{
        res.send(bodyschema)
    }
}







export const login = (req,res,users)=>{
    const {email, password} = req.body;
    const user = users.find(user => user.email === email && user.password === password);

    if (!user) res.status(401).json({status: "error", message:"Unauthenticated"})

    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    return res.status(200).json({...user, token});
}

export const authenticateToken=(req,res,next)=> {
    try{ 
        const token = req.headers.authorization?.split(" ")[1]
        if(token == null) return res.sendStatus(401)

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.user = decoded
        next()
    } catch (error){
        return res.status(401).json({status: "error", message:"Unauthenticated"})
    }

}
