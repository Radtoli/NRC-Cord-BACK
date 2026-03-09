import { Static, Type } from '@sinclair/typebox';

const UUIDParam = Type.Object({ id: Type.String({ format: 'uuid' }) });

// ── Courses ────────────────────────────────────────────
export const createCourseBodySchema = Type.Object({
  title: Type.String({ minLength: 1, maxLength: 255 }),
  description: Type.Optional(Type.String()),
  coverImageUrl: Type.Optional(Type.String({ format: 'uri' })),
});

export const updateCourseBodySchema = Type.Object({
  title: Type.Optional(Type.String({ minLength: 1, maxLength: 255 })),
  description: Type.Optional(Type.String()),
  coverImageUrl: Type.Optional(Type.String()),
  status: Type.Optional(
    Type.Union([Type.Literal('draft'), Type.Literal('published'), Type.Literal('archived')]),
  ),
});

export const courseIdParamSchema = UUIDParam;

export type CreateCourseBodyType = Static<typeof createCourseBodySchema>;
export type UpdateCourseBodyType = Static<typeof updateCourseBodySchema>;
export type CourseIdParamType = Static<typeof courseIdParamSchema>;

// ── Modules ─────────────────────────────────────────────
export const createModuleBodySchema = Type.Object({
  courseId: Type.String({ format: 'uuid' }),
  title: Type.String({ minLength: 1, maxLength: 255 }),
  description: Type.Optional(Type.String()),
  orderIndex: Type.Optional(Type.Integer({ minimum: 0 })),
  moduleType: Type.Optional(Type.Union([Type.Literal('CONTENT'), Type.Literal('PROVA')])),
  examBankId: Type.Optional(Type.String()),
});

export const updateModuleBodySchema = Type.Object({
  title: Type.Optional(Type.String({ minLength: 1, maxLength: 255 })),
  description: Type.Optional(Type.String()),
  orderIndex: Type.Optional(Type.Integer({ minimum: 0 })),
  moduleType: Type.Optional(Type.Union([Type.Literal('CONTENT'), Type.Literal('PROVA')])),
  examBankId: Type.Optional(Type.String()),
});

export const moduleIdParamSchema = UUIDParam;

export const reorderBodySchema = Type.Object({
  parentId: Type.String({ format: 'uuid' }),
  orderedIds: Type.Array(Type.String({ format: 'uuid' }), { minItems: 1 }),
});

export type CreateModuleBodyType = Static<typeof createModuleBodySchema>;
export type UpdateModuleBodyType = Static<typeof updateModuleBodySchema>;
export type ModuleIdParamType = Static<typeof moduleIdParamSchema>;
export type ReorderBodyType = Static<typeof reorderBodySchema>;

// ── Pages ────────────────────────────────────────────────
export const createPageBodySchema = Type.Object({
  moduleId: Type.String({ format: 'uuid' }),
  title: Type.String({ minLength: 1, maxLength: 255 }),
  slug: Type.Optional(Type.String({ maxLength: 300 })),
  orderIndex: Type.Optional(Type.Integer({ minimum: 0 })),
});

export const updatePageBodySchema = Type.Object({
  title: Type.Optional(Type.String({ minLength: 1, maxLength: 255 })),
  slug: Type.Optional(Type.String({ maxLength: 300 })),
  isPublished: Type.Optional(Type.Boolean()),
  orderIndex: Type.Optional(Type.Integer({ minimum: 0 })),
});

export const pageIdParamSchema = UUIDParam;

export type CreatePageBodyType = Static<typeof createPageBodySchema>;
export type UpdatePageBodyType = Static<typeof updatePageBodySchema>;
export type PageIdParamType = Static<typeof pageIdParamSchema>;

// ── Sections ─────────────────────────────────────────────
const SectionTypeEnum = Type.Union([
  Type.Literal('TEXT'),
  Type.Literal('VIDEO'),
  Type.Literal('FILE'),
  Type.Literal('SLIDES'),
  Type.Literal('STORYTELLING'),
  Type.Literal('CASE_STUDY'),
  Type.Literal('QUIZ'),
  Type.Literal('MINDMAP'),
  Type.Literal('FINAL_MESSAGE'),
  Type.Literal('DASHBOARD'),
  Type.Literal('EXAM_BANK'),
]);

export const createSectionBodySchema = Type.Object({
  pageId: Type.String({ format: 'uuid' }),
  type: SectionTypeEnum,
  title: Type.String({ minLength: 1, maxLength: 255 }),
  orderIndex: Type.Optional(Type.Integer({ minimum: 0 })),
  config: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
});

export const updateSectionBodySchema = Type.Object({
  title: Type.Optional(Type.String({ minLength: 1, maxLength: 255 })),
  orderIndex: Type.Optional(Type.Integer({ minimum: 0 })),
  config: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
});

export const updateSectionContentBodySchema = Type.Object({
  content: Type.Record(Type.String(), Type.Unknown()),
});

export const sectionIdParamSchema = UUIDParam;

export type CreateSectionBodyType = Static<typeof createSectionBodySchema>;
export type UpdateSectionBodyType = Static<typeof updateSectionBodySchema>;
export type UpdateSectionContentBodyType = Static<typeof updateSectionContentBodySchema>;
export type SectionIdParamType = Static<typeof sectionIdParamSchema>;

const QuestionTypeEnum = Type.Union([
  Type.Literal('open'),
  Type.Literal('multiple_choice'),
  Type.Literal('weighted'),
]);

const QuizOptionSchema = Type.Object({
  text: Type.String({ minLength: 1 }),
  isCorrect: Type.Optional(Type.Boolean()),
  /** Para weighted: float entre 0.0 e 1.0 */
  scoreWeight: Type.Optional(Type.Number({ minimum: 0, maximum: 1 })),
  orderIndex: Type.Optional(Type.Integer({ minimum: 0 })),
});

// ── Quizzes ───────────────────────────────────────────────
export const createQuizBodySchema = Type.Object({
  title: Type.String({ minLength: 1, maxLength: 255 }),
  description: Type.Optional(Type.String()),
  randomizeQuestions: Type.Optional(Type.Boolean()),
  questionsToShow: Type.Optional(Type.Integer({ minimum: 1 })),
  passingScore: Type.Optional(Type.Number({ minimum: 0, maximum: 100 })),
});

export const updateQuizBodySchema = Type.Partial(createQuizBodySchema);

export const addQuestionBodySchema = Type.Object({
  quizId: Type.String({ format: 'uuid' }),
  statement: Type.String({ minLength: 1 }),
  questionType: Type.Optional(QuestionTypeEnum),
  axis: Type.Optional(Type.String({ maxLength: 255 })),
  weight: Type.Optional(Type.Number({ minimum: 0.1 })),
  orderIndex: Type.Optional(Type.Integer({ minimum: 0 })),
  /** Obrigatório para multiple_choice (4 opções) e weighted (5 opções). Omitir para open. */
  options: Type.Optional(Type.Array(QuizOptionSchema, { minItems: 1 })),
});

export const submitQuizBodySchema = Type.Object({
  quizId: Type.String({ format: 'uuid' }),
  answers: Type.Array(
    Type.Object({
      questionId: Type.String({ format: 'uuid' }),
      selectedOptionId: Type.Optional(Type.String({ format: 'uuid' })),
      /** Para questões abertas */
      openAnswer: Type.Optional(Type.String()),
    }),
    { minItems: 1 },
  ),
});

export const quizIdParamSchema = UUIDParam;

export type CreateQuizBodyType = Static<typeof createQuizBodySchema>;
export type UpdateQuizBodyType = Static<typeof updateQuizBodySchema>;
export type AddQuestionBodyType = Static<typeof addQuestionBodySchema>;
export type SubmitQuizBodyType = Static<typeof submitQuizBodySchema>;
export type QuizIdParamType = Static<typeof quizIdParamSchema>;

// ── Exam Bank (MongoDB) ───────────────────────────────────
export const createExamBankBodySchema = Type.Object({
  title: Type.String({ minLength: 1, maxLength: 255 }),
  description: Type.Optional(Type.String()),
  courseId: Type.Optional(Type.String()),
});

export const updateExamBankBodySchema = Type.Object({
  title: Type.Optional(Type.String({ minLength: 1, maxLength: 255 })),
  description: Type.Optional(Type.String()),
});

export const addExamQuestionBodySchema = Type.Object({
  bankId: Type.String(),
  statement: Type.String({ minLength: 1 }),
  questionType: QuestionTypeEnum,
  axis: Type.Optional(Type.String({ maxLength: 255 })),
  options: Type.Optional(
    Type.Array(
      Type.Object({
        text: Type.String({ minLength: 1 }),
        isCorrect: Type.Optional(Type.Boolean()),
        scoreWeight: Type.Number({ minimum: 0, maximum: 1 }),
      }),
    ),
  ),
});

export const updateExamQuestionBodySchema = Type.Object({
  statement: Type.Optional(Type.String({ minLength: 1 })),
  questionType: Type.Optional(QuestionTypeEnum),
  axis: Type.Optional(Type.String({ maxLength: 255 })),
  options: Type.Optional(
    Type.Array(
      Type.Object({
        text: Type.String({ minLength: 1 }),
        isCorrect: Type.Optional(Type.Boolean()),
        scoreWeight: Type.Number({ minimum: 0, maximum: 1 }),
      }),
    ),
  ),
});

export const startExamBodySchema = Type.Object({
  bankId: Type.String(),
});

export const submitExamBodySchema = Type.Object({
  attemptId: Type.String(),
  answers: Type.Array(
    Type.Object({
      questionId: Type.String(),
      answer: Type.String(),
    }),
    { minItems: 1 },
  ),
});

export type CreateExamBankBodyType = Static<typeof createExamBankBodySchema>;
export type UpdateExamBankBodyType = Static<typeof updateExamBankBodySchema>;
export type AddExamQuestionBodyType = Static<typeof addExamQuestionBodySchema>;
export type UpdateExamQuestionBodyType = Static<typeof updateExamQuestionBodySchema>;
export type StartExamBodyType = Static<typeof startExamBodySchema>;
export type SubmitExamBodyType = Static<typeof submitExamBodySchema>;

// ── Progress ──────────────────────────────────────────────
export const recordPageProgressBodySchema = Type.Object({
  pageId: Type.String({ format: 'uuid' }),
  timeSpentSeconds: Type.Integer({ minimum: 0 }),
  completed: Type.Optional(Type.Boolean()),
});

export const courseDashboardParamSchema = Type.Object({
  courseId: Type.String({ format: 'uuid' }),
});

export type RecordPageProgressBodyType = Static<typeof recordPageProgressBodySchema>;
export type CourseDashboardParamType = Static<typeof courseDashboardParamSchema>;
