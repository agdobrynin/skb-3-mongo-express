import Pet from './models/Pet';
import User from './models/User';

export default async function saveDataInDb( data ){
  try {
      const user = new User(data.user);
      await user.save();
      const promises = data.pets.map( (pet) => {
        const petData = Object.assign({}, pet, {
          owner: user._id
        });
        return (new Pet(petData)).save();
      });

      console.log('Succes save ', data );

      return {
        user,
        pets: await Promise.all(promises)
      };
  } catch (e) {
    console.error('Can\'t save ', data, ' because error: ', e);
    throw e;
  }
}
