import { FastifyInstance } from 'fastify';
import { checkAuthMiddleware, requireRoles } from '../../../User/Http/Middlewares/checkAuthMiddleware';
import { authorizationHeadersSchema } from '../../../User/Http/Schemas/Header/authorizationHeadersSchema';

import {
  listCoursesHandler,
  getCourseHandler,
  createCourseHandler,
  updateCourseHandler,
  deleteCourseHandler,
} from '../handlers/courseHandlers';

import {
  createModuleHandler,
  listModulesHandler,
  getModuleHandler,
  updateModuleHandler,
  deleteModuleHandler,
  reorderModulesHandler,
} from '../handlers/moduleHandlers';

import {
  createPageHandler,
  listPagesHandler,
  getPageHandler,
  getFullPageHandler,
  updatePageHandler,
  deletePageHandler,
  reorderPagesHandler,
} from '../handlers/pageHandlers';

import {
  createSectionHandler,
  listSectionsHandler,
  getSectionHandler,
  updateSectionHandler,
  updateSectionContentHandler,
  deleteSectionHandler,
  reorderSectionsHandler,
} from '../handlers/sectionHandlers';

import {
  listQuizzesHandler,
  getQuizHandler,
  createQuizHandler,
  updateQuizHandler,
  deleteQuizHandler,
  addQuestionHandler,
  deleteQuestionHandler,
  submitQuizHandler,
  getRandomizedQuizHandler,
} from '../handlers/quizHandlers';

import {
  listBanksHandler,
  getBankHandler,
  createBankHandler,
  updateBankHandler,
  deleteBankHandler,
  listQuestionsHandler,
  addExamQuestionHandler,
  updateExamQuestionHandler,
  deleteExamQuestionHandler,
  startExamHandler,
  submitExamHandler,
  myAttemptsHandler,
  listPendingCorrectionsHandler,
  getAttemptForCorrectionHandler,
  submitCorrectionHandler,
} from '../handlers/examHandlers';

import {
  recordPageProgressHandler,
  getCourseDashboardHandler,
  updatePageTimeHandler,
} from '../handlers/progressHandlers';

import { uploadFileHandler } from '../handlers/uploadHandlers';

import {
  createCourseBodySchema,
  updateCourseBodySchema,
  courseIdParamSchema,
  createModuleBodySchema,
  updateModuleBodySchema,
  moduleIdParamSchema,
  createPageBodySchema,
  updatePageBodySchema,
  pageIdParamSchema,
  createSectionBodySchema,
  updateSectionBodySchema,
  updateSectionContentBodySchema,
  sectionIdParamSchema,
  reorderBodySchema,
  createQuizBodySchema,
  updateQuizBodySchema,
  addQuestionBodySchema,
  submitQuizBodySchema,
  quizIdParamSchema,
  createExamBankBodySchema,
  updateExamBankBodySchema,
  addExamQuestionBodySchema,
  updateExamQuestionBodySchema,
  startExamBodySchema,
  submitExamBodySchema,
  recordPageProgressBodySchema,
  courseDashboardParamSchema,
} from '../schemas/avaSchemas';

// Handler cast helper — resolves Fastify v5 generic type mismatch
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function h(fn: any) { return fn as any; }

// Role shortcuts
const managerOnly = [checkAuthMiddleware, requireRoles(['manager'])];
const authenticated = [checkAuthMiddleware];
const correctorOrManager = [checkAuthMiddleware, requireRoles(['corretor', 'manager'])];

export async function avaRoutes(fastify: FastifyInstance) {
  // ================================================================
  // COURSES
  // ================================================================
  fastify.get('/courses', {
    schema: { headers: authorizationHeadersSchema },
    preHandler: authenticated,
  }, h(listCoursesHandler));

  fastify.get('/courses/:id', {
    schema: { params: courseIdParamSchema, headers: authorizationHeadersSchema },
    preHandler: authenticated,
  }, h(getCourseHandler));

  fastify.post('/courses', {
    schema: { body: createCourseBodySchema, headers: authorizationHeadersSchema },
    preHandler: managerOnly,
  }, h(createCourseHandler));

  fastify.put('/courses/:id', {
    schema: { params: courseIdParamSchema, body: updateCourseBodySchema, headers: authorizationHeadersSchema },
    preHandler: managerOnly,
  }, h(updateCourseHandler));

  fastify.delete('/courses/:id', {
    schema: { params: courseIdParamSchema, headers: authorizationHeadersSchema },
    preHandler: managerOnly,
  }, h(deleteCourseHandler));

  // ================================================================
  // MODULES
  // ================================================================
  fastify.post('/modules', {
    schema: { body: createModuleBodySchema, headers: authorizationHeadersSchema },
    preHandler: managerOnly,
  }, h(createModuleHandler));

  fastify.get('/courses/:courseId/modules', {
    schema: {
      params: { type: 'object', properties: { courseId: { type: 'string' } } },
      headers: authorizationHeadersSchema,
    },
    preHandler: authenticated,
  }, h(listModulesHandler));

  fastify.get('/modules/:id', {
    schema: { params: moduleIdParamSchema, headers: authorizationHeadersSchema },
    preHandler: authenticated,
  }, h(getModuleHandler));

  fastify.put('/modules/:id', {
    schema: { params: moduleIdParamSchema, body: updateModuleBodySchema, headers: authorizationHeadersSchema },
    preHandler: managerOnly,
  }, h(updateModuleHandler));

  fastify.delete('/modules/:id', {
    schema: { params: moduleIdParamSchema, headers: authorizationHeadersSchema },
    preHandler: managerOnly,
  }, h(deleteModuleHandler));

  fastify.put('/modules/reorder', {
    schema: { body: reorderBodySchema, headers: authorizationHeadersSchema },
    preHandler: managerOnly,
  }, h(reorderModulesHandler));

  // ================================================================
  // PAGES
  // ================================================================
  fastify.post('/pages', {
    schema: { body: createPageBodySchema, headers: authorizationHeadersSchema },
    preHandler: managerOnly,
  }, h(createPageHandler));

  fastify.get('/modules/:moduleId/pages', {
    schema: {
      params: { type: 'object', properties: { moduleId: { type: 'string' } } },
      headers: authorizationHeadersSchema,
    },
    preHandler: authenticated,
  }, h(listPagesHandler));

  fastify.get('/pages/:id', {
    schema: { params: pageIdParamSchema, headers: authorizationHeadersSchema },
    preHandler: authenticated,
  }, h(getPageHandler));

  /** Full page for renderer: sections + content */
  fastify.get('/pages/:id/full', {
    schema: { params: pageIdParamSchema, headers: authorizationHeadersSchema },
    preHandler: authenticated,
  }, h(getFullPageHandler));

  fastify.put('/pages/:id', {
    schema: { params: pageIdParamSchema, body: updatePageBodySchema, headers: authorizationHeadersSchema },
    preHandler: managerOnly,
  }, h(updatePageHandler));

  fastify.delete('/pages/:id', {
    schema: { params: pageIdParamSchema, headers: authorizationHeadersSchema },
    preHandler: managerOnly,
  }, h(deletePageHandler));

  fastify.put('/pages/reorder', {
    schema: { body: reorderBodySchema, headers: authorizationHeadersSchema },
    preHandler: managerOnly,
  }, h(reorderPagesHandler));

  // ================================================================
  // SECTIONS
  // ================================================================
  fastify.post('/sections', {
    schema: { body: createSectionBodySchema, headers: authorizationHeadersSchema },
    preHandler: managerOnly,
  }, h(createSectionHandler));

  fastify.get('/pages/:pageId/sections', {
    schema: {
      params: { type: 'object', properties: { pageId: { type: 'string' } } },
      headers: authorizationHeadersSchema,
    },
    preHandler: authenticated,
  }, h(listSectionsHandler));

  fastify.get('/sections/:id', {
    schema: { params: sectionIdParamSchema, headers: authorizationHeadersSchema },
    preHandler: authenticated,
  }, h(getSectionHandler));

  fastify.put('/sections/:id', {
    schema: { params: sectionIdParamSchema, body: updateSectionBodySchema, headers: authorizationHeadersSchema },
    preHandler: managerOnly,
  }, h(updateSectionHandler));

  /** Set or replace the content of a section */
  fastify.put('/sections/:id/content', {
    schema: { params: sectionIdParamSchema, body: updateSectionContentBodySchema, headers: authorizationHeadersSchema },
    preHandler: managerOnly,
  }, h(updateSectionContentHandler));

  fastify.delete('/sections/:id', {
    schema: { params: sectionIdParamSchema, headers: authorizationHeadersSchema },
    preHandler: managerOnly,
  }, h(deleteSectionHandler));

  fastify.put('/sections/reorder', {
    schema: { body: reorderBodySchema, headers: authorizationHeadersSchema },
    preHandler: managerOnly,
  }, h(reorderSectionsHandler));

  // ================================================================
  // QUIZZES
  // ================================================================
  fastify.get('/quizzes', {
    schema: { headers: authorizationHeadersSchema },
    preHandler: authenticated,
  }, h(listQuizzesHandler));

  fastify.get('/quizzes/:id', {
    schema: { params: quizIdParamSchema, headers: authorizationHeadersSchema },
    preHandler: authenticated,
  }, h(getQuizHandler));

  /** Get randomized questions for a quiz attempt */
  fastify.get('/quizzes/:id/start', {
    schema: { params: quizIdParamSchema, headers: authorizationHeadersSchema },
    preHandler: authenticated,
  }, h(getRandomizedQuizHandler));

  fastify.post('/quizzes', {
    schema: { body: createQuizBodySchema, headers: authorizationHeadersSchema },
    preHandler: managerOnly,
  }, h(createQuizHandler));

  fastify.put('/quizzes/:id', {
    schema: { params: quizIdParamSchema, body: updateQuizBodySchema, headers: authorizationHeadersSchema },
    preHandler: managerOnly,
  }, h(updateQuizHandler));

  fastify.delete('/quizzes/:id', {
    schema: { params: quizIdParamSchema, headers: authorizationHeadersSchema },
    preHandler: managerOnly,
  }, h(deleteQuizHandler));

  fastify.post('/quiz-questions', {
    schema: { body: addQuestionBodySchema, headers: authorizationHeadersSchema },
    preHandler: managerOnly,
  }, h(addQuestionHandler));

  fastify.delete('/quiz-questions/:id', {
    schema: {
      params: { type: 'object', properties: { id: { type: 'string' } } },
      headers: authorizationHeadersSchema,
    },
    preHandler: managerOnly,
  }, h(deleteQuestionHandler));

  fastify.post('/quiz/submit', {
    schema: { body: submitQuizBodySchema, headers: authorizationHeadersSchema },
    preHandler: authenticated,
  }, h(submitQuizHandler));

  // ================================================================
  // PROGRESS
  // ================================================================
  fastify.post('/progress/page', {
    schema: { body: recordPageProgressBodySchema, headers: authorizationHeadersSchema },
    preHandler: authenticated,
  }, h(recordPageProgressHandler));

  fastify.post('/progress/page/time', {
    schema: {
      body: {
        type: 'object',
        required: ['pageId', 'seconds'],
        properties: { pageId: { type: 'string' }, seconds: { type: 'integer', minimum: 1 } },
      },
      headers: authorizationHeadersSchema,
    },
    preHandler: authenticated,
  }, h(updatePageTimeHandler));

  fastify.get('/progress/course/:courseId', {
    schema: { params: courseDashboardParamSchema, headers: authorizationHeadersSchema },
    preHandler: authenticated,
  }, h(getCourseDashboardHandler));

  // ================================================================
  // UPLOAD
  // ================================================================
  fastify.post('/upload', {
    schema: { headers: authorizationHeadersSchema },
    preHandler: managerOnly,
  }, h(uploadFileHandler));

  // ================================================================
  // EXAM BANKS (banco de questões — MongoDB)
  // ================================================================
  fastify.get('/exam-banks', {
    schema: { headers: authorizationHeadersSchema },
    preHandler: authenticated,
  }, h(listBanksHandler));

  fastify.get('/exam-banks/:id', {
    schema: {
      params: { type: 'object', properties: { id: { type: 'string' } } },
      headers: authorizationHeadersSchema,
    },
    preHandler: authenticated,
  }, h(getBankHandler));

  fastify.post('/exam-banks', {
    schema: { body: createExamBankBodySchema, headers: authorizationHeadersSchema },
    preHandler: managerOnly,
  }, h(createBankHandler));

  fastify.put('/exam-banks/:id', {
    schema: {
      params: { type: 'object', properties: { id: { type: 'string' } } },
      body: updateExamBankBodySchema,
      headers: authorizationHeadersSchema,
    },
    preHandler: managerOnly,
  }, h(updateBankHandler));

  fastify.delete('/exam-banks/:id', {
    schema: {
      params: { type: 'object', properties: { id: { type: 'string' } } },
      headers: authorizationHeadersSchema,
    },
    preHandler: managerOnly,
  }, h(deleteBankHandler));

  // ── Exam Questions ──────────────────────────────────────────────

  fastify.get('/exam-banks/:bankId/questions', {
    schema: {
      params: { type: 'object', properties: { bankId: { type: 'string' } } },
      headers: authorizationHeadersSchema,
    },
    preHandler: authenticated,
  }, h(listQuestionsHandler));

  fastify.post('/exam-questions', {
    schema: { body: addExamQuestionBodySchema, headers: authorizationHeadersSchema },
    preHandler: managerOnly,
  }, h(addExamQuestionHandler));

  fastify.put('/exam-questions/:id', {
    schema: {
      params: { type: 'object', properties: { id: { type: 'string' } } },
      body: updateExamQuestionBodySchema,
      headers: authorizationHeadersSchema,
    },
    preHandler: managerOnly,
  }, h(updateExamQuestionHandler));

  fastify.delete('/exam-questions/:id', {
    schema: {
      params: { type: 'object', properties: { id: { type: 'string' } } },
      headers: authorizationHeadersSchema,
    },
    preHandler: managerOnly,
  }, h(deleteExamQuestionHandler));

  // ── Exam Attempts ────────────────────────────────────────────────

  fastify.post('/modules/:moduleId/exam/start', {
    schema: {
      params: { type: 'object', properties: { moduleId: { type: 'string' } } },
      headers: authorizationHeadersSchema,
    },
    preHandler: authenticated,
  }, h(startExamHandler));

  fastify.post('/exam/submit', {
    schema: { body: submitExamBodySchema, headers: authorizationHeadersSchema },
    preHandler: authenticated,
  }, h(submitExamHandler));

  fastify.get('/exam/my-attempts', {
    schema: {
      querystring: {
        type: 'object',
        properties: { moduleId: { type: 'string' } },
      },
      headers: authorizationHeadersSchema,
    },
    preHandler: authenticated,
  }, h(myAttemptsHandler));

  // ── Correction (corretor / admin) ────────────────────────────────

  fastify.get('/exam/corrections', {
    schema: {
      querystring: {
        type: 'object',
        properties: { all: { type: 'string' } },
      },
      headers: authorizationHeadersSchema,
    },
    preHandler: correctorOrManager,
  }, h(listPendingCorrectionsHandler));

  fastify.get('/exam/corrections/:id', {
    schema: {
      params: { type: 'object', properties: { id: { type: 'string' } } },
      headers: authorizationHeadersSchema,
    },
    preHandler: correctorOrManager,
  }, h(getAttemptForCorrectionHandler));

  fastify.post('/exam/corrections/:id/submit', {
    schema: {
      params: { type: 'object', properties: { id: { type: 'string' } } },
      body: {
        type: 'object',
        required: ['feedbacks'],
        properties: {
          feedbacks: {
            type: 'array',
            items: {
              type: 'object',
              required: ['questionId', 'feedback'],
              properties: {
                questionId: { type: 'string' },
                feedback: { type: 'string' },
              },
            },
          },
          generalFeedback: { type: 'string' },
        },
      },
      headers: authorizationHeadersSchema,
    },
    preHandler: correctorOrManager,
  }, h(submitCorrectionHandler));
}

