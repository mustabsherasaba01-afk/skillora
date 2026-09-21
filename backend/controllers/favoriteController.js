const Favorite = require('../models/Favorite');
const Project = require('../models/Project');
const User = require('../models/User');

const toggle = (field, Model) => async (req, res, next) => {
  try {
    const target = await Model.findById(req.params.id);
    if (!target) return res.status(404).json({ success: false, message: 'Item not found' });
    const query = { user: req.user._id, [field]: req.params.id };
    const existing = await Favorite.findOne(query);
    if (existing) { await existing.deleteOne(); return res.json({ success: true, message: 'Removed from favorites', data: { favorited: false } }); }
    await Favorite.create(query);
    res.status(201).json({ success: true, message: 'Added to favorites', data: { favorited: true } });
  } catch (error) { next(error); }
};
const listFavorites = async (req, res, next) => { try { res.json({ success: true, message: 'Favorites retrieved', data: await Favorite.find({ user: req.user._id }).populate('project').populate('freelancer', '-password') }); } catch (error) { next(error); } };
const remove = (field) => async (req, res, next) => { try { await Favorite.findOneAndDelete({ user: req.user._id, [field]: req.params.id }); res.json({ success: true, message: 'Removed from favorites', data: {} }); } catch (error) { next(error); } };
module.exports = { favoriteProject: toggle('project', Project), favoriteFreelancer: toggle('freelancer', User), removeProject: remove('project'), removeFreelancer: remove('freelancer'), listFavorites };
