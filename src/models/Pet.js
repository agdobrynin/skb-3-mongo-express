import mongoose from 'mongoose';
//If you use mondodb version less then 4
import timestamps from 'mongoose-timestamp';
import _ from 'lodash';

const { Schema } = mongoose;

const PetSchema = new Schema({
  type:{
     type: String,
     enum: ['cat', 'dog', 'pokemon'],
     required: true
  },
  name: {
    type: String,
    required: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});
//If you use mondodb version less then 4
PetSchema.plugin(timestamps);
//Return only need fields
PetSchema.methods.toJSON = function () {
  return _.pick(this, ['type','name', 'owner']);
};
export default mongoose.model('Pet', PetSchema);
