import { Response, NextFunction } from "express";
import { Examination, Semister, Test } from "../../schemas/Exams/Exams";
import { examinationsDataValidation } from "./utils/validation";
import { generateError } from "../config/function";
import Section from "../../schemas/Class/Section";

const createExamination = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = examinationsDataValidation.validate(req.body, {
      abortEarly: false,
    });

    if (result.error) {
      throw generateError(result.error.details[0], 422);
    }

    const section = await Section.findById(req.body.section)

    if(!section) {
      throw generateError(`This Section does not exists`, 400)
    }

    req.body.company = req.bodyData.company;

    const savedExaminations = [];

    for (const examinationData of req.body.examinationsData) {
      examinationData.createdBy = req.userId;
      examinationData.company = req.bodyData.company;

      const examination = new Examination(examinationData);
      const savedExamination = await examination.save();
      savedExaminations.push(savedExamination);

      const semesters: any = [];
      for (const semesterData of examinationData.semestersData) {
        const semester = new Semister(semesterData);
        const savedSemester: any = await semester.save();

        if (semesterData.noOfTest && semesterData.noOfTest.length > 0) {
          const testObjects = [];
          for (const testData of semesterData.noOfTest) {
            const test = new Test(testData);
            testObjects.push(test);
          }

          const savedTests = await Promise.all(
            testObjects.map((test) => test.save())
          );
          savedSemester.noOfTest = savedTests;
        }
        await savedSemester.save();
        semesters.push(savedSemester._id);
      }

      savedExamination.semister = semesters;
      await savedExamination.save();
      section.examination = savedExamination._id
      await section.save()
    }

    const fetchData: any = [];
    await Promise.all(
      savedExaminations.map(async (item) => {
        const semesters = await Examination.findById(item._id).populate("semister");
        fetchData.push(semesters);
      })
    );

    res.status(201).send({
      message: "Created Exams Successfully",
      data: fetchData,
      statusCode: 201,
      success: true,
    });
  } catch (err) {
    next(err);
  }
};


const getExamBySection = async (req : any , res : Response, next : NextFunction) => {
  try
  {
    const exams = await Examination.findById(req.params.section).populate('semister')
    res.status(200).send({
      data : exams,
      message : 'Get Exams Successfully',
      statusCode : 200,
      status : 'success'
    })
  }
  catch(err)
  {
    next(err)
  }
}


export { createExamination, getExamBySection };
