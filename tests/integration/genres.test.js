const request=require('supertest');
const {Genre}=require('../../model/genre');
const {User}=require('../../model/user');
let server;
describe('api/genres',()=>{
    beforeEach(()=>{server = require('../../index');})
    afterEach(async () => { 
        await Genre.remove({});
        await server.close(); 
        
    });
    describe('GET/',()=>{
        it('should return all genres',async ()=>{
            const genres = [
                { name: 'genre1' },
                { name: 'genre2' }
              ];
            await Genre.collection.insertMany(genres);
            const res=await request(server).get('/api/genres');
            expect(res.status).toBe(200);
        });
    });
    describe('GET/:id',()=>{
      it('should return a valid  genres id exist',async ()=>{
          const genre = new Genre({name:'genre12'});
          await genre.save();
          const res=await request(server).get('/api/genres/'+genre._id);
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty('name',genre.name);
      });
      it('should return a 404 status',async ()=>{
        const genre = new Genre({name:'genre12'});
        
        const res=await request(server).get('/api/genres/1'+genre._id);
        expect(res.status).toBe(404);
      });
    });
    describe('POST/',()=>{
      let token;
      let name;
      const exec=async ()=>{
        return await request(server)
          .post('/api/genres')
          .set('x-auth-token',token)
          .send({name});
      }
      beforeEach(()=>{
        token=new User().generateAuthToken();
        name="genre1";
      });



      it('should return a 401 if client is not logged in',async ()=>{
         token='';
         const res=await exec();
         expect(res.status).toBe(401);
      });
      it('should return a 400 if genre less than 5 char',async ()=>{
        name='1234';
        const res=await exec();
        expect(res.status).toBe(400);
      });
      it('should return a 400 if genre more than 50 char',async ()=>{
        name=new Array(52).join('a');
        const res=await exec();
        expect(res.status).toBe(400);
      });
      it('should save genre if it is valid',async ()=>{
        
        await exec();
        const genre=await Genre.find({name:"genre1111"})
       expect(genre).not.toBeNull();
      });
      it('should save genre if it is valid',async ()=>{
        

        const res=await exec();
      
        expect(res.body).toHaveProperty('_id');
        expect(res.body).toHaveProperty('name',name);
      });
    });
});
