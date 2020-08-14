const request=require('supertest');
const {User}=require('../../model/user');
let server;
describe('auth middleware',()=>{
    beforeEach(()=>{server = require('../../index');})
    afterEach(async () => { await server.close();});
    let token;
    const exec=()=>{
       return request(server)
       .post('/api/genres')
       .set('x-auth-token',token)
       .send({name:'genres1'})
    };
    beforeEach(()=>{
        token=new User().generateAuthToken();
    })
    it('should return 401 if no token is provided',async ()=>{
        token='';
        const res=await exec();
        expect(res.status).toBe(401);
    });
    it('should return 200 if no token is invalid',async ()=>{
        
        const res=await exec();
        expect(res.status).toBe(200);
    });
});