const server = require("express").Router();
const express = require("express");
const path = require('path');
const {literal} = require ('sequelize');
const { sequelize } = require("sequelize");
const { QueryTypes } = require('sequelize');
const { db } = require("../db");
const { Op } = require('sequelize');

var public = path.join(__dirname,'../../uploads');

const { Desarrollo, ImgDesarrollo, AmenidadesDesarrollo, TipodePropiedad, TipoOperacion, Estado, Municipio, Ciudad, 
  Colonia, Cliente, amenidades_del_desarrollos, ModeloAsociadoAlDesarrollo, ImgModeloAsociado,
  Organizacion, AutorizacionesXTipodeOrg, VideoYoutube, Tour3D,
} = require("../db");

// Se incluye el modelo Cliente el cual arroja datos de FAVORITOS
server.get("/getDataandImagenPropiedades",  async (req, res) => {
  try {
    let {userId} = req.query;
    const desarrollo = await Desarrollo.findAll({
      where:{publicada:true},
      order: [
        ['precioMin','DESC']
      ],
      include: [
        {
          model: Organizacion,
          include: [
            {
              model: AutorizacionesXTipodeOrg
            }
          ]
        },
        {
          model: ImgDesarrollo,
          attributes: ['id','orden','img_name','thumbnail_img','detalles_imgGde','detalles_imgChica'],
          separate:true,
          order: [
            ['orden','ASC']
          ],
        },      
        {
          model: AmenidadesDesarrollo,
          through: {
            attributes: []
          }
        },
        {
          model: TipodePropiedad
        },
        {
          model: TipoOperacion
        },
        {
          model: Ciudad
        },
        {
          model: Municipio
        },
        {
          model: Estado
        },
        {
          model: Colonia
        },
        {// El modelo Cliente da la relacion de desarrollos_favoritos
          model:Cliente,
          attributes: ["id", "userId"],
          required: false, // Mantiene propiedades sin clientes
          where: userId ? { userId } : {userId:"x000"} // Filtra solo si se pasa un userId, de lo contrario se da un UserId que no existe
        },
        
      ]
    });
    userId? console.log("Get Data Propiedad " + JSON.stringify(userId)):console.log("Get data Propiedad")
    res.json(desarrollo)
  }
  catch(error){
    console.log(error)
      res.json(error)
  }
})

server.get("/getPropiedadNombre/:userId", async (req, res) => {
  try {
    const {userId} = req.params;
    console.log("Get Nombre Prop " + userId)
    const cliente = await Cliente.findOne({
      where:{userId:userId}
    });
    const dataPropiedad = await Desarrollo.findAll({
      where:{OrganizacionId:cliente.OrganizacionId},
      attributes: ['id', 'nombreDesarrollo', 'posicion', 'TipodePropiedadId'],
      
    });
    dataPropiedad? res.json(dataPropiedad) : res.json({Mensaje:"No se encontraron datos de propiedades"});
    
  } catch (e) {
    res.send(e);
  } 
}
);

/*    REQ QUERY

server.get("/detallespropiedad", async (req, res) => {
  try {
    const {id} = req.query 
  In Browser   /detallespropiedad/?id=2
*/

server.get("/detallespropiedad/:id", async (req, res) => {
  try {
    const {id} = req.params;
    const {userId} = req.query;
    console.log("Buscando Detalles" + id);
    const dataPropiedad = await Desarrollo.findOne({
      where:{id:id},
      order: [
        [ImgDesarrollo,'orden','ASC']
      ],
      include: [
        {
          model: ImgDesarrollo,
          attributes: ['id','orden','img_name','thumbnail_img','detalles_imgGde','detalles_imgChica'],
        },
        {
          model:VideoYoutube
        },
        {
          model: Tour3D
        }, 
        {
          model: AmenidadesDesarrollo,
          through: {
            attributes: []
          }
        },
        {
          model: TipodePropiedad
        },
        {
          model: TipoOperacion
        },
        {
          model: Ciudad
        },
        {
          model: Municipio
        },
        {
          model: Estado
        },
        {
          model: Colonia
        },
        {// El modelo Cliente da la relacion de desarrollos_favoritos
          model:Cliente,
          attributes: ["id", "userId"],
          required: false, // Mantiene propiedades sin clientes
          where: userId ? { userId } : {userId:"x000"} // Filtra solo si se pasa un userId, de lo contrario se da un UserId que no existe
        },
      ]
    })
    dataPropiedad? res.json(dataPropiedad) : res.json({Mensaje:"No se encontro la propiedad"});
  } catch (e) {
    res.send(e);
  }
});

function isAuthenticated (req, res, next) {
  console.log("77 En IS AUTH " +req.session.passport)
  if (req.session.passport.user) {
    console.log("79 SI ESTA Authenticado ")
    next()}
  else next('route')
}


server.get("/getAmenidadesDesarrolloSeleccionado/:id", async (req, res) => {
  try {
    const {id} = req.params;
    console.log("Buscando Amenidades" + id);
    const amenidades = await amenidades_del_desarrollos.findAll({
      where:{DesarrolloId:id},
    });
    /* const dataPropiedad = await Propiedad.findOne({
      where:{id:id},
      attributes: ["id", "nombreDesarrollo"],
      include: [
        {
          model: AmenidadesDesarrollo,
          through: {
            attributes: []
          }
        },
        
      ]
    }) */
    amenidades? res.json(amenidades) : res.json({Mensaje:"No se encontro la propiedad"});
  } catch (e) {
    res.send(e);
  }
})

server.get("/seedRefId", async (req, res) => {
  try {
    const Desarrollo = await Desarrollo.findAll();
    for (let i = 0; i < Desarrollo.length; i++) {
      Desarrollo[i].ref_id = literal('uuid_generate_v4()'); 
      await Desarrollo[i].save();
    }
    res.json(Desarrollo)
  } catch (e) {
    res.send(e)
  }
});

server.get("/actualizar/:propId/:orgId", async (req, res) =>{
  try {
    const {propId, orgId} = req.params
    const propiedad = await Desarrollo.findOne({
      where:{id:propId},
    })
    /* propiedad.OrganizacionId="e29c1eae-6bc4-4e18-9799-995e8ab00994"
    await propiedad.save(); */
    await propiedad.update({OrganizacionId:orgId})
    res.send(propiedad)
  } catch (error) {
    res.send(error)
  }
})

server.get("/actualizarPublicacion", async (req, res) =>{
  try {
    const propiedad = await Desarrollo.findAll();
    for (let i = 0; i < propiedad.length; i++) {
      await propiedad[i].update({publicada:"Si"})
    }
    res.send(propiedad)
  } catch (error) {
    res.send(error)
  }
})

server.get("/getPropOrganizacion/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const cliente = await Cliente.findOne({where:{userId}})
    const dataPropiedad = await Desarrollo.findAll({
      where:{ OrganizacionId:cliente.OrganizacionId },
      order: [
        ['precioMin','ASC']
      ],
      include: [
        {
          model: ImgDesarrollo,
          attributes: ['id','orden','img_name','thumbnail_img','detalles_imgGde','detalles_imgChica'],
          separate:true,
          order: [
            ['orden','ASC']
          ],
        },       
        {
          model: AmenidadesDesarrollo,
          through: {
            attributes: []
          }
        },
        {
          model: TipodePropiedad
        },
        {
          model: TipoOperacion
        },
        {
          model: Ciudad
        },
        {
          model: Municipio
        },
        {
          model: Estado
        },
        {
          model: Colonia
        },
      ]
    },);
    
    dataPropiedad? res.json(dataPropiedad) : res.json({Mensaje:"No se encontraron datos de propiedades"});
    
  } catch (e) {
    res.send(e);
  } 
});

server.get("/cuentaxOrg", async (req, res) => {
  try {

     const dataPropiedad = await Desarrollo.findAll({
      where:{publicada:true},
      include: [
        {
          model: Organizacion,
          include: [
            {
              model: AutorizacionesXTipodeOrg
            }
          ]
        },
      ]
      
    })
    /*const maxVentas = org[0].AutorizacionesXTipodeOrg.cantidadPropVenta;
    const propOrgId = prop.OrganizacionId
    const cuentadeVentas = prop.TipoOperacionId;
    const cuentaPropiedades = [];
    const cuentas = {
      org:"",
      cuentadeVentas:"",
      cuentadeRentas:"",
    }
    const dataPropAmpliada = [];
    for (let i = 0; i < dataPropiedad.length; i++) {
     
      //venta
      if(dataPropiedad.TipoOperacionId===1){
        cuentas.org = dataPropiedad.OrganizacionId;
        cuentas.cuentadeVentas = +1
      }
      if(dataPropiedad.TipoOperacionId===3){
        cuentas.org = dataPropiedad.OrganizacionId;
        cuentas.cuentadeRentas = +1
      }      
    } */
    

    /* const cuentaProps = await Propiedad.count(
      {
        where:{publicada:"Si"}, 
        attributes: ['publicada','OrganizacionId'], 
        group:['publicada','OrganizacionId'] 
    }); */
    /* const OrgConMasProps = [];
    for (let i = 0; i < cuentaProps.length; i++) {
      if(cuentaProps[i].count>2){
        OrgConMasProps.push(cuentaProps[i].OrganizacionId)
      }
    } */
    
    /* const org = await Organizacion.findAll({
      include:  AutorizacionesXTipodeOrg
    })
    
    
    

    const orgConPublicacionesdeMas = [];
    for (let i = 0; i < cuentaProps.length; i++) {
      for (let x = 0; x < org.length; x++) {
        const publicacionesdeMas = {
          organizacion:org[x].id,
          venta:"",
          renta:""
        }
        if(cuentaProps[i].OrganizacionId === org[x].id){
          if(cuentaProps[i].count > org[0].AutorizacionesXTipodeOrg.cantidadPropVenta){ 
            publicacionesdeMas.venta = org[0].AutorizacionesXTipodeOrg.cantidadPropVenta - cuentaProps[i].count;
          }
          if(cuentaProps[i].count > org[0].AutorizacionesXTipodeOrg.cantidadPropRenta){
            publicacionesdeMas.renta = org[0].AutorizacionesXTipodeOrg.cantidadPropRenta - cuentaProps[i].count;
          }
          // Si hay rentas o ventas de mas se manda al array
          if(publicacionesdeMas.venta || publicacionesdeMas.renta){
            orgConPublicacionesdeMas.push(publicacionesdeMas);
          }
        }
        
      }
    } */
    res.send(dataPropiedad )
  }
  catch(error){
    res.send(error)
  }
})

server.get("/orgyTipo", async (req, res) => {
  try {
    const org = await Organizacion.findAll({
      include:  AutorizacionesXTipodeOrg
    })
    
    res.send(org)
  }
  catch(error){
    res.send(error)
  }
})

server.get("/publicar/:desarrolloId", async (req,res) => {
  try{
    const { desarrolloId } = req.params;
    const desarrollo = await Desarrollo.findByPk(desarrolloId);
    desarrollo.publicada = !desarrollo.publicada;
    await desarrollo.save();
    
    res.json(desarrollo)
  } catch(error){
    res.json(error)
  }
})

server.get("/hardDelete/:Id", async (req,res) => {
  try {
    const {Id} = req.params
    const prop = await Desarrollo.findOne({
      where:{id:Id}
    })
    await prop.destroy();
    res.json("BORRADO")
  } catch (error) {
    res.json(error)
  }
})


// Para ver las imagenes
server.use('/imagenes', express.static(public));

module.exports =  server;


/* 
Consulta RAW SQL
where: {
  id: {
    [Op.in]: db.literal(`(SELECT id FROM "Clientes" WHERE id = '${cliente.id}')`)
  }
} 
  */