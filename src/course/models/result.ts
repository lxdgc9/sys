import { Schema, Types, model } from "mongoose";

interface IResult {
  class_id: Types.ObjectId;
  user: Types.ObjectId;
  term1: {
    regular_scores: {
      score1: number;
      score2: number;
      score3: number;
      score4: number;
      score5: number;
    };
    midterm_score: number;
    final_score: number;
    overall_score: number;
  };
  term2: {
    regular_scores: {
      score1: number;
      score2: number;
      score3: number;
      score4: number;
      score5: number;
    };
    midterm_score: number;
    final_score: number;
    overall_score: number;
  };
  final: {
    average_score_term1: number;
    average_score_term2: number;
    average_score: number;
  };
}

const resultSchema = new Schema<IResult>(
  {
    class_id: {
      type: Schema.Types.ObjectId,
      ref: "class",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    term1: {
      regular_scores: {
        score1: {
          type: Number,
        },
        score2: {
          type: Number,
        },
        score3: {
          type: Number,
        },
        score4: {
          type: Number,
        },
        score5: {
          type: Number,
        },
      },
      midterm_score: {
        type: Number,
      },
      final_score: {
        type: Number,
      },
      overall_score: {
        type: Number,
      },
    },
    term2: {
      regular_scores: {
        score1: {
          type: Number,
        },
        score2: {
          type: Number,
        },
        score3: {
          type: Number,
        },
        score4: {
          type: Number,
        },
        score5: {
          type: Number,
        },
      },
      midterm_score: {
        type: Number,
      },
      final_score: {
        type: Number,
      },
      overall_score: {
        type: Number,
      },
    },
    final: {
      average_score_term1: {
        type: Number,
      },
      average_score_term2: {
        type: Number,
      },
      average_score: {
        type: Number,
      },
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

export const Result = model("result", resultSchema);
