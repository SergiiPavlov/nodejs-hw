import createHttpError from "http-errors";
import { Note } from "../models/note.js";

export const getAllNotes = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, tag, search } = req.query;

    const pageNum = Number(page) || 1;
    const perPageNum = Number(perPage) || 10;
    const skip = (pageNum - 1) * perPageNum;

    const filter = {};

    if (tag) {
      filter.tag = tag;
    }

    if (search !== undefined) {
      const value = search.trim();
      if (value !== "") {
        filter.$text = { $search: value };
      }
    }

    const [totalNotes, notes] = await Promise.all([
      Note.countDocuments(filter),
      Note.find(filter).skip(skip).limit(perPageNum)
    ]);

    const totalPages = Math.max(1, Math.ceil(totalNotes / perPageNum) || 1);

    res.status(200).json({
      page: pageNum,
      perPage: perPageNum,
      totalNotes,
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

    const note = await Note.findById(noteId);

    if (!note) {
      return next(createHttpError(404, "Note not found"));
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

export const createNote = async (req, res, next) => {
  try {
    const note = await Note.create(req.body);
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

    const note = await Note.findOneAndDelete({ _id: noteId });

    if (!note) {
      return next(createHttpError(404, "Note not found"));
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findOneAndUpdate({ _id: noteId }, req.body, {
      new: true
    });

    if (!note) {
      return next(createHttpError(404, "Note not found"));
    }

    res.status(200).json(note);
  } catch (error) {
    if (error.name === "ValidationError") {
      return next(createHttpError(400, error.message));
    }
    next(error);
  }
};
