const { Role } = require("../models");

exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({});

    res.send(roles);
  } catch (error) {
    res.send( error.message );
  }
}

exports.addRole = async (req, res) => {
  const { roleName, abbreviation, power } = req.body;
    try {
          const role = new Role({ roleName, abbreviation, power });
          await role.save();
          
          res.send(role);

    } catch (error) {
        res.send(error.message);
    }
}

exports.updateRole =async(req,res)=>{
  try {
    const roleId = parseInt(req.params.id, 10);
    Role.update(req.body, {
        where: { id: roleId }
    })
    .then(num => {
        if (num == 1) {
            res.send({
                message: "Role was updated successfully."
            });
        } else {
            res.send({
                message: `Cannot update Role with id=${roleId}. Maybe Role was not found or req.body is empty!`
            });
        }
    })
    .catch(error => {
        // Handle any errors that occur during the update process
        res.send(error.message);
    });
  } catch (error) {
      // Handle any unexpected errors
      res.send(error.message);
  }

}

exports.deleteRole = async(req,res)=>{
    try {
        const result = await Role.destroy({
            where: { id: req.params.id },
            force: true,
        });

        if (result === 0) {
            return res.status(404).json({
              status: "fail",
              message: "Role with that ID not found",
            });
          }
      
          res.status(204).json();
        }  catch (error) {
          res.send(error.message);
    }
    
}

exports.getRoleById = async (req, res) => {
  try {
    const role = await Role.findOne({where: {id: req.params.id}, order:['id']})

    res.send(role);
  } catch (error) {
    res.send(error.message);
  }  
}
