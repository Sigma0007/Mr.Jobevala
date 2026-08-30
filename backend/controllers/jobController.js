import CompanyProfile from "../models/CompanyProfile.js";
import Job from "../models/Job.js";
import SavedJob from "../models/SavedJob.js";
import Application from "../models/Application.js";

import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

// CREATE JOB
export const createJob = catchAsync(async (req, res, next) => {
    const {
        title,
        description,
        skills,
        jobType,
        experience,
        salary,
        location,
        vacancies,
        status,
        applicationDeadline,
    } = req.body;

    if (!title || !description || !location?.city) {
        return next(
            new AppError(
                "Title, company name, description and city are required",
                400,
            ),
        );
    }
    const companyData = await CompanyProfile.findOne({ user: req.user.id });
    if (!companyData) {
        return next(
            new AppError(
                "Company profile not found",
                404,
            ),
        );
    }

    const job = await Job.create({
        provider: req.user._id,
        companyProfile: companyData?._id,

        title,
        description,
        skills,
        jobType,
        experience,
        salary,
        location,
        vacancies,
        status,
        applicationDeadline,
    });

    res.status(201).json({
        success: true,
        message: "Job created successfully",
        data: job,
    });
});

export const getAllJobs = catchAsync(async (req, res) => {
    const jobs = await Job.find({}).populate("companyProfile").sort({
        createdAt: -1,
    });

    res.status(200).json({
        success: true,
        total: jobs.length,
        data: jobs,
    });
});

// GET PROVIDER JOBS
export const getMyJobs = catchAsync(async (req, res) => {
    const jobs = await Job.find({
        provider: req.user._id,
    }).sort({
        createdAt: -1,
    });

    res.status(200).json({
        success: true,
        total: jobs.length,
        data: jobs,
    });
});

// GET SINGLE PROVIDER JOB
export const getMyJobById = catchAsync(async (req, res, next) => {
    const job = await Job.findOne({
        _id: req.params.id,
        provider: req.user._id,
    });

    if (!job) {
        return next(new AppError("Job not found", 404));
    }

    res.status(200).json({
        success: true,
        data: job,
    });
});

// UPDATE JOB
export const updateJob = catchAsync(async (req, res, next) => {
    const job = await Job.findOne({
        _id: req.params.id,
        provider: req.user._id,
    });

    if (!job) {
        return next(
            new AppError("Job not found or you don't have permission", 404),
        );
    }

    const allowedFields = [
        "title",
        "description",
        "skills",
        "jobType",
        "experience",
        "salary",
        "location",
        "vacancies",
        "status",
        "applicationDeadline",
    ];

    allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
            job[field] = req.body[field];
        }
    });

    await job.save();

    res.status(200).json({
        success: true,
        message: "Job updated successfully",
        data: job,
    });
});

// DELETE JOB
export const deleteJob = catchAsync(async (req, res, next) => {
    const job = await Job.findOne({
        _id: req.params.id,
        provider: req.user._id,
    });

    if (!job) {
        return next(new AppError("Job not found", 404));
    }

    await job.deleteOne();

    res.status(200).json({
        success: true,
        message: "Job deleted successfully",
    });
});

// CHANGE JOB STATUS
export const updateJobStatus = catchAsync(async (req, res, next) => {
    const { status } = req.body;

    if (!["active", "closed", "draft"].includes(status)) {
        return next(new AppError("Invalid job status", 400));
    }

    const job = await Job.findOne({
        _id: req.params.id,
        provider: req.user._id,
    });

    if (!job) {
        return next(new AppError("Job not found", 404));
    }

    job.status = status;

    await job.save();

    res.status(200).json({
        success: true,
        message: `Job ${status} successfully`,
        data: job,
    });
});

// SAVE JOB
export const saveJob = catchAsync(async (req, res, next) => {
    const job = await Job.findById(req.params.id);

    if (!job) {
        return next(new AppError("Job not found", 404));
    }

    const alreadySaved = await SavedJob.findOne({
        user: req.user._id,
        job: req.params.id,
    });

    if (alreadySaved) {
        return next(new AppError("Job already saved", 200));
    }

    const savedJob = await SavedJob.create({
        user: req.user._id,
        job: req.params.id,
    });

    res.status(201).json({
        success: true,
        message: "Job saved successfully",
        data: savedJob,
    });
});

// GET SAVED JOBS
export const getSavedJobs = catchAsync(async (req, res) => {
    const savedJobs = await SavedJob.find({
        user: req.user._id,
    }).populate({
        path: "job",
        populate: {
            path: "companyProfile"
        }
    }).sort({
        createdAt: -1,
    });

    res.status(200).json({
        success: true,
        total: savedJobs.length,
        data: savedJobs,
    });
});

// REMOVE SAVED JOB
export const removeSavedJob = catchAsync(async (req, res, next) => {
    const savedJob = await SavedJob.findOne({
        job: req.params.id,
        user: req.user._id,
    });

    if (!savedJob) {
        return next(new AppError("Saved job not found", 404));
    }

    await savedJob.deleteOne();

    res.status(200).json({
        success: true,
        message: "Saved job removed successfully",
    });
});

// GET PROVIDER STATS
export const getProviderStats = catchAsync(async (req, res) => {
    const providerId = req.user._id;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // 1. Active Job Postings
    const activeJobsCount = await Job.countDocuments({
        provider: providerId,
        status: "active"
    });
    const activeJobsThisWeek = await Job.countDocuments({
        provider: providerId,
        status: "active",
        createdAt: { $gte: oneWeekAgo }
    });

    // 2. Total Applications
    const totalApplicationsCount = await Application.countDocuments({
        provider: providerId
    });
    const applicationsThisWeek = await Application.countDocuments({
        provider: providerId,
        createdAt: { $gte: oneWeekAgo }
    });

    // 3. Candidates Hired
    const hiredCount = await Application.countDocuments({
        provider: providerId,
        status: "hired"
    });
    const hiredThisWeek = await Application.countDocuments({
        provider: providerId,
        status: "hired",
        updatedAt: { $gte: oneWeekAgo }
    });

    const stats = [
        {
            id: 'activeJobs',
            value: activeJobsCount.toString(),
            change: activeJobsThisWeek,
        },
        {
            id: 'totalApplications',
            value: totalApplicationsCount.toString(),
            change: applicationsThisWeek,
        },
        {
            id: "hiredCandidates",
            value: hiredCount.toString(),
            change: hiredThisWeek,
        },
    ];

    res.status(200).json({
        success: true,
        data: stats,
    });
});
