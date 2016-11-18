import mongoose from 'mongoose';
//If you use mondodb version less then 4
import timestamps from 'mongoose-timestamp';
import _ from 'lodash';

const { Schema } = mongoose;

const UserSchema = new Schema({
  name:{
    type: String,
    required: true
  }
});
//Return only need fields
UserSchema.methods.toJSON = function () {
  return _.pick(this, ['name']);
};
//If you use mondodb version less then 4
UserSchema.plugin(timestamps);
export default mongoose.model('User', UserSchema);
