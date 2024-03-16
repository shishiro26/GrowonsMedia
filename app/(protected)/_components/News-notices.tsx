import React from "react";
import { getNewsById } from "@/lib/news";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const NewsNotices = async () => {
  const news = await getNewsById();
  const newsLength = (await getNewsById()).length;

  return (
    <div className="border-2 mt-4 mx-2 md:mt-10 border-black  p-2 rounded-lg">
      <span className="m-2">News and Notices</span>
      <div className="grid grid-cols-1 md:grid-cols-3">
        {newsLength === 0 ? (
          <div className="m-2 font-serif">Nothing to show here</div>
        ) : (
          <>
            {news?.map((n) => {
              return (
                <Card key={n.id} className="m-2 md:w-[300px] h-fit">
                  <CardHeader>
                    <CardTitle className="text-2xl font-semibold">
                      {n.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">{n.content}</CardContent>
                </Card>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default NewsNotices;
