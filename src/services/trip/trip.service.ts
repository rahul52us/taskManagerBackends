import { NextFunction, Response } from "express";
import {
  createTrip,
  getTrips,
  updateTrip,
} from "../../repository/trip.repository";

export const createTripService = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, bodyData } = req;
    const { company } = bodyData;

    req.body.company = company;
    req.body.createdBy = userId;

    const { status, data } = await createTrip(req.body);
    res.status(201).send({
      status: status,
      data: data,
    });
  } catch (err) {
    next(err);
  }
};

export const getTripsService = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status, data } = await getTrips(req.body);
    res.status(200).send({
      status: status,
      data: data,
    });
  } catch (err: any) {
    next(err);
  }
};

export const updateTripService = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    req.body._id = req.params.id
    const { status, data } = await updateTrip(req.body);
    if (status === "success") {
      res.status(200).send({
        status: status,
        data: data,
      });
    } else {
      res.status(400).send({
        status: status,
        data: data,
      });
    }
  } catch (err) {
    next(err);
  }
};