const mongoose = require('mongoose');

const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
    first_name: { type: String, required: true, max: 100 },
    family_name: { type: String, required: true, max: 100 },
    date_of_birth: { type: Date },
    date_of_death: { type: Date }
})

AuthorSchema.virtual('name').get(function() {
    return this.family_name + ', ' + this.first_name;
});

AuthorSchema.virtual('lifespan').get(function() {
    return (this.date_of_death - this.date_of_birth).toString();
});

AuthorSchema.virtual('url').get(function() {
    return '/catalog/author/' + this._id;
});

AuthorSchema.virtual('date_of_birth_formatted').get(function() {
    return this.date_of_birth ? DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_SHORT) : '';
});

AuthorSchema.virtual('date_of_death_formatted').get(function() {
    return this.date_of_death ? DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_SHORT) : '';
})

module.exports = mongoose.model('Author', AuthorSchema);