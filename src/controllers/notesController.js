import createHttpError from "http-errors";
import { Note } from "../models/note.js";

export const getAllNotes = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, tag, search } = req.query;

    const pageNum = Number(page) || 1;
    const perPageNum = Number(perPage) || 10;
    const skip = (pageNum - 1) * perPageNum;

    const filter = {
      userId: req.user._id
    };

    if (tag) {
      filter.tag = tag;
    }

    if (search) {
      filter.$text = { $search: search };
    }

    const [notes, total] = await Promise.all([
      Note.find(filter).skip(skip).limit(perPageNum),
      Note.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / perPageNum) || 1;

    res.status(200).json({
      page: pageNum,
      perPage: perPageNum,
      totalNotes: total,
      totalPages,
      notes
    });
  } catch (error) {
    next(error);
  }
};

export const getNoteById = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findOne({
      _id: noteId,
      userId: req.user._id
    });

    if (!note) {
      return next(createHttpError(404, "Note not found"));
    }

    res.status(200).json(note);
  } catch (error) {
    if (error.name === "CastError") {
      return next(createHttpError(400, "Invalid note id"));
    }
    next(error);
  }
};

export const createNote = async (req, res, next) => {
  try {
    const { title, content = "", tag = "Todo" } = req.body;

    const note = await Note.create({
      title,
      content,
      tag,
      userId: req.user._id
    });

    res.status(201).json(note);
  } catch (error) {
    if (error.name === "ValidationError") {
      return next(createHttpError(400, error.message));
    }
    next(error);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findOneAndDelete({
      _id: noteId,
      userId: req.user._id
    });

    if (!note) {
      return next(createHttpError(404, "Note not found"));
    }

    res.status(200).json(note);
  } catch (error) {
    if (error.name === "CastError") {
      return next(createHttpError(400, "Invalid note id"));
    }
    next(error);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const updateData = req.body;

    const note = await Note.findOneAndUpdate(
      {
        _id: noteId,
        userId: req.user._id
      },
      updateData,
      {
        new: true
      }
    );

    if (!note) {
      return next(createHttpError(404, "Note not found"));
    }

    res.status(200).json(note);
  } catch (error) {
    if (error.name === "ValidationError") {
      return next(createHttpError(400, error.message));
    }
    if (error.name === "CastError") {
      return next(createHttpError(400, "Invalid note id"));
    }
    next(error);
  }
};
