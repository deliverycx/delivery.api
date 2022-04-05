import { Types } from "mongoose";

export function createPipeline(match: object, userId: UniqueId): Array<any> {
    return [
        match,
        {
            $lookup: {
                from: "stoplists",
                as: "stoplist",
                let: { productGUID: "$id", organization: "$organization" },
                pipeline: [
                    {
                        $addFields: {
                            isInStopList: {
                                $cond: [
                                    {
                                        $in: [
                                            "$$productGUID",
                                            "$stoplist.product"
                                        ]
                                    },
                                    true,
                                    false
                                ]
                            }
                        }
                    },
                    {
                        $replaceRoot: {
                            newRoot: { isInStopList: "$isInStopList" }
                        }
                    }
                ]
            }
        },
        {
            $set: {
                stoplist: "$stoplist.isInStopList"
            }
        },
        {
            $match: {
                $or: [
                    {
                        stoplist: false
                    },
                    {
                        stoplist: { $size: 0 }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "favorites",
                as: "favorites",
                let: { productId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            user: userId || new Types.ObjectId(userId),
                            $expr: { $in: ["$$productId", "$products"] }
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                isFav: {
                    $cond: [{ $eq: [{ $size: "$favorites" }, 1] }, true, false]
                }
            }
        },
        {
            $unset: "favorites"
        }
    ];
}
