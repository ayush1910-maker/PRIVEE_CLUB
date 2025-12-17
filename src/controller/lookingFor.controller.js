import lookingFor from "../models/lookingFor.model.js";


const addlookingForTitle = async (req ,res ) => {
    try {

        let data = req.body

        if(!Array.isArray(data)){
            data = [data]
        }

        const titles = await lookingFor.bulkCreate(data)

        return res.json({
            status: true,
            message: "titles added successfully",
            data: titles
        })
        
    } catch (error) {
        return res.json({status: false , message: error.meessage})
    }
}

const editlookingForTitle = async (req ,res) => {
    try {
        const {id} = req.params
        const { title } = req.body

        const titles = await lookingFor.findByPk(id)
        if(!titles){
            return res.json({status: false , message: "title not found"})
        }

        titles.title = title ?? titles.title  
       // titles.title = old value  // stays same
 
        await titles.save()

        return res.json({
            status: true,
            message: "edited successfully",
            data: titles
        })

    } catch (error) {
        return res.json({status: false , message: error.message})
    }
}

export {
    addlookingForTitle,
    editlookingForTitle
}